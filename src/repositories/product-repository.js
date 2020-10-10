'use strict';

const Product = require('../models/product');

exports.get = async() =>{
    const res = await Product
                        .find(
                                { active: true },
                                'title price slug'
                            );
    return res;
}

exports.getBySlug = async(slug) => {
    const res = await Product
                        .findOne(
                        { 
                            slug : slug, 
                            active: true 
                        },
                        'title description price slug tags'
                        );
    return res;
}

exports.getById = async(id) => {
    const res = await Product.findById(id, "title description slug price tags");
    return res;
}

exports.getByTag = async(tag) => {
    const res = await Product
                        .find(
                            { 
                                tags: tag,
                                active: true 
                            },
                            'title description price slug tags');
    return res;
}

exports.create = async(data) => {
    
    var product = new Product();

    product.title       = data.title;
    product.description = data.description;
    product.slug        = data.slug;
    product.price       = data.price;
    product.active      = data.active;
    product.tags        = data.tags;

    await product.save();
}

exports.update = async(id, data) => {
    await Product
        .findByIdAndUpdate(
            id,
            {$set: {
                    title: data.title,
                    description: data.description,
                    slug: data.slug,
                    price: data.price,
                    tags: data.tags
                } 
            }
        );   
}

exports.delete = async(id) => {
    await Product.findOneAndRemove(id);
}