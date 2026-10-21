import React, { useEffect } from 'react'
import ProductDescription from '../productdetail/ProductDetail'
import Layout from '../layout/Layout'
import { useSelector } from 'react-redux'

const ProductDescriptionPage = ({ slug }) => {
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => { }, [language?.id])
    return (
        <Layout>
            <ProductDescription slug={slug} />
        </Layout>
    )
}

export default ProductDescriptionPage