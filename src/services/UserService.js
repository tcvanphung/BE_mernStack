const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const createUser = (newUser) => {
	return new Promise(async (resolve, reject) => {
		const { name, email, password, phone } = newUser
		try {
			const checkUser = await User.findOne({
				email: email
			})
			if (checkUser !== null) {
				resolve({
					status: 'ERR',
					message: 'The email is already',
				})
			}

			const hash = bcrypt.hashSync(password, 10)

			const createdUser = await User.create({
				name,
				email,
				password: hash,
				phone
			})
			if (createdUser) {
				resolve({
					status: 'OK',
					message: 'SUCCESS',
					data: createdUser
				})
			}
		} catch (e) {
			console.log(e)
			reject(e)
		}
	})
}


//------ loginUser
const loginUser = (UserLogin) => {
	return new Promise(async (resolve, reject) => {
		const { email, password } = UserLogin
		try {
			const checkUser = await User.findOne({
				email: email
			})
			if (checkUser === null) {
				resolve({
					status: 'ERR',
					message: 'The user is not defined',
				})
			}
			const comparePassword = bcrypt.compareSync(password, checkUser.password)

			if (!comparePassword) {
				resolve({
					status: 'ERR',
					message: 'The password or user is incorrect',
				})
			}
			const access_token = await genneralAccessToken({
				id: checkUser.id,
				isAdmin: checkUser.isAdmin
			})
			const refresh_token = await genneralRefreshToken({
				id: checkUser.id,
				isAdmin: checkUser.isAdmin
			})

			console.log('access_token', access_token)
			resolve({
				status: 'OK',
				message: 'SUCCESS',
				access_token,
				refresh_token
			})
			// }
		} catch (e) {
			console.log(e)
			reject(e)
		}
	})
}


//------ updateUser
const updateUser = (id, data) => {
	return new Promise(async (resolve, reject) => {
		// const { name, email, password, confirmPassword, phone } = updateUser
		try {
			const checkUser = await User.findOne({
				_id: id
			})
			if (checkUser === null) {
				resolve({
					status: 'OK',
					message: 'The user is not defined',
				})
			}

			const updateUser = await User.findByIdAndUpdate(id, data, { new: true })
			resolve({
				status: 'OK',
				message: 'SUCCESS',
				date: updateUser
			})
		} catch (e) {
			reject(e)
		}
	})
}


//------deleteUser
const deleteUser = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkUser = await User.findOne({
				_id: id
			})
			if (checkUser === null) {
				resolve({
					status: 'OK',
					message: 'The user is not defined',
				})
			}

			await User.findByIdAndDelete(id)
			resolve({
				status: 'OK',
				message: 'Delete user SUCCESS',
			})
		} catch (e) {
			console.log(e)
			reject(e)
		}
	})
}

//------getAllUser
const getAllUser = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const allUser = await User.find()
			resolve({
				status: 'OK',
				message: 'Success',
				data: allUser
			})
		} catch (e) {
			console.log(e)
			reject(e)
		}
	})
}


//------getDetailsUser
const getDetailsUser = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.findOne({
				_id: id
			})
			if (user === null) {
				resolve({
					status: 'OK',
					message: 'The user is not defined',
				})
			}
			resolve({
				status: 'OK',
				message: 'SUCCESS',
				data: user
			})
		} catch (e) {
			console.log(e)
			reject(e)
		}
	})
}

module.exports = {
	createUser,
	loginUser,
	updateUser,
	deleteUser,
	getAllUser,
	getDetailsUser,
}