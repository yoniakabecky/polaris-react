# typed: true
# frozen_string_literal: true
require_relative 'tree_content'

module DevelopmentSupport
  module Github
    class Tree
      attr_accessor :sha, :contents

      def initialize(hash_param)
        @sha = hash_param[:sha]
        @contents = TreeContent.new(hash_param[:tree])
      end
    end
  end
end
