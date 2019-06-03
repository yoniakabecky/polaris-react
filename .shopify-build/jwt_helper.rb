# typed: true
# frozen_string_literal: true
require 'jwt'

module DevelopmentSupport
  class JWTHelper
    def self.new_jwt_token(pem)
      private_key = OpenSSL::PKey::RSA.new(pem)
      JWT.encode(payload, private_key, "RS256")
    end

    def self.payload
      {
        iat: Time.now.to_i,
        exp: Time.now.to_i + (10 * 60),
        iss: 5382,
      }
    end
  end
end
