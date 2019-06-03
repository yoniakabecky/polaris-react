# typed: true
# frozen_string_literal: true

module DevelopmentSupport
  module Github
    class TreeNode
      attr_accessor :path, :mode, :type, :size, :sha, :url

      def initialize(params)
        @path = params[:path]
        @mode = params[:mode]
        @type = params[:type]
        @size = params[:size]
        @sha  = params[:sha]
        @url  = params[:url]
      end

      def to_h
        {
          path: @path,
          mode: @mode,
          type: @type,
          sha: @sha,
        }
      end

      def ==(other)
        @path == other.path &&
        @mode == other.mode &&
        @type == other.type &&
        @size == other.size &&
        @sha  == other.sha  &&
        @url  == other.url
      end
    end
  end
end
