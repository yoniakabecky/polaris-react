# typed: true
# frozen_string_literal: true
require_relative 'tree_node'

module DevelopmentSupport
  module Github
    class TreeContent
      attr_accessor :contents

      # GitHub file modes
      # @see https://developer.github.com/v3/git/trees/#create-a-tree
      GITHUB_FILE_MODE = {
        file: '100644',
        subdirectory: '040000',
        submodule: '160000',
      }

      def initialize(contents_array)
        @contents = contents_array.map { |t| Github::TreeNode.new(t) }
      end

      def find_tree(target_path_name)
        idx = @contents.find_index do |node|
          node.path == target_path_name &&
          node.mode == GITHUB_FILE_MODE[:subdirectory] &&
          node.type == "tree"
        end
        return nil if idx.nil?
        @contents[idx]
      end

      def delete_files(filenames)
        @contents.delete_if do |node|
          filenames.include?(node.path) &&
          node.mode == GITHUB_FILE_MODE[:file] &&
          node.type == "blob"
        end
      end

      def update_files(filenames)
        @contents.each do |node|
          next unless filenames.include?(node.path) && node.mode == GITHUB_FILE_MODE[:file] && node.type == "blob"
          node.sha = yield(node)
        end
      end

      def map(&block)
        @contents.map(&block)
      end

      def size
        @contents.size
      end

      def to_a
        @contents.map(&:to_h)
      end
    end
  end
end
