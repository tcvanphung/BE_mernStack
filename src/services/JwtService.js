const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const genneralAccessToken = async (payload) => {
	const access_token = jwt.sign({
		payload
	}, process.env.ACCESS_TOKEN, { expiresIn: '30s' })

	return access_token
}

const genneralRefreshToken = async (payload) => {
	const refresh_token = jwt.sign({
		payload
	}, process.env.REFRESH_TOKEN, { expiresIn: '360d' })

	return refresh_token
}

const refreshTokenJwtService = (token) => {
	return new Promise((resolve, reject) => {
		try {

			console.log('token', token)
			jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
				if (err) {
					console.log('err', err)
					resolve({
						status: 'ERROR',
						message: 'The authemtication'
					})
				}
				console.log('user', user)
				const { payload } = user
				const access_token = await genneralAccessToken({
					id: payload?.id,
					isAdmin: payload?.isAdmin
				})
				console.log('access_token', access_token)
				resolve({
					status: 'OK',
					message: 'Success',
					access_token
				})
			})

		} catch (e) {
			reject(e)
		}
	})
}

module.exports = {
	genneralAccessToken,
	genneralRefreshToken,
	refreshTokenJwtService
}