const Product = require("../models/ProductModel")
const bcrypt = require("bcrypt")

const createProduct = (newProduct) => {
	return new Promise(async (resolve, reject) => {
		const { name, image, type, price, countInStock, rating, description } = newProduct
		try {
			const checkUser = await Product.findOne({
				name: name
			})
			if (checkUser !== null) {
				resolve({
					status: 'OK',
					message: 'The name of product is already',
				})
			}


			const createdProduct = await Product.create({
				name, image, type, price, countInStock, rating, description
			})
			if (createdProduct) {
				resolve({
					status: 'OK',
					message: 'SUCCESS',
					data: createdProduct
				})
			}
		} catch (e) {
			console.log(e)
			reject(e)
		}
	})
}



//------ updateProduct
const updateProduct = (id, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkProduct = await Product.findOne({
				_id: id
			})
			if (checkProduct === null) {
				resolve({
					status: 'OK',
					message: 'The product is not defined',
				})
			}

			const updateProduct = await Product.findByIdAndUpdate(id, data, { new: true })
			resolve({
				status: 'OK',
				message: 'SUCCESS',
				date: updateProduct
			})
		} catch (e) {
			reject(e)
		}
	})
}


//------getDetailsProduct
const getDetailsProduct = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const product = await Product.findOne({
				_id: id
			})
			if (product === null) {
				resolve({
					status: 'OK',
					message: 'The product is not defined',
				})
			}
			resolve({
				status: 'OK',
				message: 'SUCCESS',
				data: product
			})
		} catch (e) {
			reject(e)
		}
	})
}


//------deleteProduct
const deleteProduct = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkProduct = await Product.findOne({
				_id: id
			})
			if (checkProduct === null) {
				resolve({
					status: 'OK',
					message: 'The product is not defined',
				})
			}

			await Product.findByIdAndDelete(id)
			resolve({
				status: 'OK',
				message: 'Delete product SUCCESS',
			})
		} catch (e) {
			reject(e)
		}
	})
}


//------getAllProduct
const getAllProduct = (limit, page, sort, filter) => {
	return new Promise(async (resolve, reject) => {
		try {
			const totalProduct = 0 //await Product.countDocuments()
			if (filter) {
				const label = filter[0]
				const allProductFilter = await Product.find({
					[label]: { '$regex': filter[1] }
				}).limit(limit).skip(page * limit)
				resolve({
					status: 'OK',
					message: 'Success',
					data: allProductFilter,
					total: totalProduct,
					pageCurrent: Number(page + 1),
					totalPage: Math.ceil(totalProduct / limit),
				})
			}
			if (sort) {
				const objectSort = {}
				objectSort[sort[1]] = sort[0]
				const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort)
				resolve({
					status: 'OK',
					message: 'Success',
					data: allProductSort,
					total: totalProduct,
					pageCurrent: Number(page + 1),
					totalPage: Math.ceil(totalProduct / limit),
				})
			}
			const allProduct = await Product.find().limit(limit).skip(page * limit)
			resolve({
				status: 'OK',
				message: 'Success',
				data: allProduct,
				total: totalProduct,
				pageCurrent: Number(page + 1),
				totalPage: Math.ceil(totalProduct / limit),
			})
		} catch (e) {
			console.log(e)
			reject(e)
		}
	})
}


module.exports = {
	createProduct,
	updateProduct,
	getDetailsProduct,
	deleteProduct,
	getAllProduct
}