# typed: true
# frozen_string_literal: true
require 'octokit'
require_relative './../jwt_helper'

module DevelopmentSupport
  module Github
    # This client uses Octokit to access the GitHub APIs.
    # Authentication to the GitHub APIs is done through GitHub Integrations.
    #
    # For more information:
    # * Shopify + GitHub Integrations: https://github.com/Shopify/vendor-github#github-integrations
    # * Octokit Source: https://github.com/octokit/octokit.rb
    # * GitHub APIs: https://developer.github.com/v3/
    class APIClient
      # GitHub Shopify Core Installation ID
      INSTALLATION_ID = 54319

      # Creates an installation access token, expires after 1 hour
      def self.integration_client(pem = ENV['GITHUB_PEM'])
        client = Octokit::Client.new(bearer_token: DevelopmentSupport::JWTHelper.new_jwt_token(pem))
        resource = client.create_installation_access_token(INSTALLATION_ID).to_h
        client.access_token = resource.fetch(:token)
        client
      end
    end
  end
end
