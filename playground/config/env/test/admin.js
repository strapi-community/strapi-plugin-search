module.exports = ({ env }) => ({
	auth: {
		secret: env("ADMIN_JWT_SECRET", "some-auth-secret"),
	},
	apiToken: {
		salt: env("API_TOKEN_SALT", "some-api-token-salt"),
	},
	transfer: {
		token: {
			salt: env("TRANSFER_TOKEN_SALT", "some-tranfer-token-salt"),
		},
	},
});
