# typed: true
# frozen_string_literal: true
require_relative 'api_client'
require_relative './tree'

module DevelopmentSupport
  module Github
    # For local development:
    #
    # Tests are recorded using VCR, to record tests please use the GitHub PEM
    # found in the Prod Eng Github 1Password Vault.
    #
    # You can download the PEM, place it in the rails root (ie. shopify/ ) and then run tests with:
    #     RECORD_TESTS=1 dev t test/unit/lib/development_support/github/github_helper_test.rb
    #
    # After recording the tests, be sure to delete the first recorded request
    # including the access token for the GitHub API.
    class GitHubHelper
      BASE_BRANCH = 'master'

      # Creates a GitHub API helper for a given repository and obtains an API access token
      # This class uses Octokit with the shopify core dev-ci GitHub integration
      # @see https://github.com/octokit/octokit.rb
      #
      # @param repository [String] the name of the Shopify repository
      # @example Create a helper for Shopify core
      #   github_helper = DevelopmentSupport::GitHubHelper.new('Shopify/shopify')
      def initialize(repository)
        @repo = repository
        @github_client = Github::APIClient.integration_client
      end

      # Formats filenames, checks preconditions and then calls commit_changes_and_create_pr to delete or update files
      #
      # @param branch [String] name of non master branch that is to contain these changes
      # @param filenames [Hash] a hash with key :update and :delete mapping to an array of filenames
      #   NOTE: provided filenames must be relative to the project directory and joined by File.join()
      # @param commit_message [String] the commit message for the changes
      def change_files(branch, filenames, commit_message, pr_content)
        update_files = filenames.fetch(:update, [])
        delete_files = filenames.fetch(:delete, [])

        # Group every file by its directory
        # ['db/migrate/migration1.rb', 'db/migrate/migration2', 'db/lhm/lhm1.rb', 'db/lhm/lhm2.rb']
        # {
        #   'db/migrate/' => ['migration1.rb', 'migration2.rb'],
        #   'db/lhm/' => ['lhm1.rb', 'lhm2.rb']
        # }
        grouped_update_files = group_files_by_dirname(update_files)
        grouped_deleted_files = group_files_by_dirname(delete_files)

        # is there anything to change? we dont want to create an empty commit and PR.
        return nil if grouped_deleted_files.empty? && !has_changes?(grouped_update_files)

        # merge the two hashes of grouped files, if a collision occurs, merge their array values as well
        changing_files = grouped_update_files.merge(grouped_deleted_files) do |_, update_names, delete_names|
          update_names + delete_names
        end

        commit_changes_and_create_pr(branch, changing_files, commit_message, pr_content) do |current_path, tree_content|
          # if there are files to be updated
          if grouped_update_files.key?(current_path)
            tree_content.update_files(grouped_update_files[current_path]) do |node|
              @github_client.create_blob(@repo, File.read("#{current_path}/#{node.path}"))
            end
          end

          # if there are files to be deleted
          if grouped_deleted_files.key?(current_path)
            tree_content.delete_files(grouped_deleted_files[current_path])
          end
        end
      end

      # Creates a branch, modifies a list of files from a directory, commits and creates a PR.
      #
      # @param branch_name [String] name of non master branch that is to contain these changes
      # @param files [Hash] A hash mapping the path of the file directory to the names of the files
      #   @example { 'path/to/folder' => ['file1.rb', 'file2.rb'] }
      # @param commit_message [String] commit message for the deleted files
      # @param pr_content [Hash] A hash containing a 'title' and 'body' key used for the pr title and body
      # @return [Sawyer::Resource] A hash representing the generated pull request
      # @example delete_files_commit_and_create_pr method above
      def commit_changes(branch_name, files, commit_message)
        # Get master's latest commit and create a branch
        commit = @github_client.commits(@repo, BASE_BRANCH, per_page: 1).first
        create_branch(branch_name, commit)

        begin
          # Traverse the Git tree to find the subdirectory, delete files and create a new tree structure
          updated_root_tree = update_tree(files.keys) do |current_path, tree_content|
            yield current_path, tree_content
          end

          # Commit new tree structure
          new_commit = @github_client.create_commit(@repo, commit_message, updated_root_tree.sha, commit[:sha])
          @github_client.update_ref(@repo, "heads/#{branch_name}", new_commit[:sha], false)
        rescue
          @github_client.delete_branch(@repo, branch_name) unless branch_name == 'master'
          raise
        end
      end

      # Creates a branch
      #
      # @param branch_name [String] name of to-be created branch
      # @param commit [#[]] the commit to point the new branch to
      # @return [Sawyer::Resource] A hash representing the created branch
      # @example create a branch off master
      #   github_helper.create_branch('feature/delete-old-migrations', github_helper.branch_commits.first)
      def create_branch(branch_name, commit)
        raise "Cannot create new branch. No commit given for #{BASE_BRANCH}." if commit.nil?

        @github_client.create_ref(@repo, "heads/#{branch_name}", commit[:sha])
      end

      # Update a git tree in the specified branch
      #
      # @param paths_to_update [Array] array of paths to update
      # @param branch [String] the branch that this method acts on
      # @param procedure [Block] the procedure to be performed on the git tree content passed in via an array
      # @return [Tree] A Tree object representing the updated root tree after the procedure has been performed
      # @example delete files in the db/migrations folder
      #   github_helper.update_tree([['db', 'migrate']], 'feature/delete-old-migrations') do |path, tree_content|
      #     tree_content.delete_if do |content|
      #       ['sample_migration1.rb', 'sample_migration2.rb'].include?(content[:path])
      #     end
      #   end
      def update_tree(paths_to_update, branch = BASE_BRANCH, &procedure)
        raise ArgumentError, 'paths is not an array' unless paths_to_update.is_a?(Array)

        # Get the root tree
        root_tree_sha = @github_client.commits(@repo, branch).first[:commit][:tree][:sha]
        root_tree_contents = Github::Tree.new(@github_client.tree(@repo, root_tree_sha)).contents

        # Convert a list of directories into an array of arrays that represent the paths
        # to be updated and each directory
        # e.g. ['db/migrate', 'test/unit'] becomes [['db', 'migrate'], ['test', 'unit']]
        paths_to_update = paths_to_update.map { |path| path.split('/') }

        # paths_to_update would include ['.'] if the file exists in the root directory
        #   (ie. File.dirname('README.md') == '.')
        # this represents the top level of the repository and requires special handling
        if paths_to_update.include?(['.'])
          paths_to_update.delete(['.'])
          yield '.', root_tree_contents
        end

        # Update files in specified subdirectories
        update_subtree(paths_to_update, root_tree_contents, [], &procedure)
      end

      private

      # Recursive helper that searches for the target directory down the specified path,
      # and then performs the procedure on that directory.
      # As the recursive stack gets popped off, a new tree is created with the updated content.
      def update_subtree(paths_to_update, parent_content, current_directory, &procedure)
        # Group by the first entry of each array of arrays
        # Example:
        #   paths = [['db', 'maintenance', 'maintenance'], ['unit', 'test',' maintenance'], ['db','migrate']]
        #   paths.group_by(&:shift)
        #   => {
        #    "db"   => [["maintenance", "maintenance"], ["migrate"]],
        #    "unit" => [["test", " maintenance"]]
        #   }
        subdirectory_paths = paths_to_update.group_by(&:shift)

        # Find each subdirectory, get its contents
        # Update the subdirectory if it's the end of the path or recursively call update_subtree
        # From our example above, in the first iteration,
        #  subdir will be "db" and paths will be [["maintenance", "maintenance"], ["migrate"]]
        subdirectory_paths.each do |subdir, paths|
          directory = parent_content.find_tree(subdir)
          raise "The directory #{subdir} cannot be found." if directory.nil?

          target_directory = current_directory + [subdir]
          target_content = Github::Tree.new(@github_client.tree(@repo, directory.sha)).contents

          # If we're at the end of the path (e.g. when subdirectory_paths = { 'some_directory' => [[]] })
          # This is when we want to call our procedure and create the tree
          # Otherwise, we can recursively call through the tree using the paths that we just parsed out
          # These paths will be grouped again and we will continue until we reach the end of each branch
          if paths.include?([])
            paths.delete([])
            yield File.join(*target_directory), target_content
          end
          new_subtree = update_subtree(paths, target_content, target_directory, &procedure)
          directory.sha = new_subtree.sha
        end

        # Create the new updated subtree
        Github::Tree.new(@github_client.create_tree(@repo, parent_content.to_a))
      end

      def has_changes?(file_paths)
        file_paths.any? do |directory, filenames|
          filenames.any? do |file|
            file_path = File.join(directory, file)
            remote_file = @github_client.contents(@repo, path: file_path, ref: BASE_BRANCH)
            local_content = File.read(file_path)
            Base64.decode64(remote_file[:content]) != local_content
          end
        end
      end

      def group_files_by_dirname(paths_array)
        # group each of the paths by their directory name
        grouped_paths = paths_array.group_by { |path| File.dirname(path) }
        # convert the hash values from the full path to basename
        grouped_paths.transform_values! do |paths|
          paths.map { |path| File.basename(path) }
        end
        grouped_paths
      end
    end
  end
end
