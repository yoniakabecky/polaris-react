# frozen_string_literal: true

require 'open3'
module DevelopmentSupport
  module Github
    module GithubUsernameLoader
      class << self
        def author_github_username
          # Extracts github username by attempting to ssh into git.
          _, stderr, _status = Open3.capture3("ssh -o ConnectTimeout=10 git@github.com")

          # Something that can't be an username at github.
          username = "@@unknown@@"
          stderr.each_line do |line|
            next unless line.downcase.start_with?("hi")
            username = line.split(" ")[1].strip
            if username[-1] == "!"
              username = username[0..-2]
            end

            break
          end

          [username, stderr]
        end
      end
    end
  end
end
