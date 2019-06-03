# frozen_string_literal: true
require_relative './github/github_helper'

module DevelopmentSupport
  class CreateTestBranch
    def initialize(repository_name = 'Shopify/polaris-styleguide',
      branch = "testing-alpha-test-branch")
      @github_helper = Github::GitHubHelper.new(repository_name)
      @branch = branch
    end

    def create_branch
      puts 'Now committing the changes on a new branch.'
      branch = @github_helper.change_files(
        @branch,
        {
          update: ['./../package.json', './../yarn.lock']
        },
        commit_message,
      )

      if branch
        puts "Branch created"
      else
        puts "Error creating branch"
        return 1
      end
    end

    private

    def commit_message
      <<~EOF
        Update Polaris to test version

        This is an automated commit
      EOF
    end
  end
end
