import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import ProductDescription from '../productdetail/ProductDetail'
import Layout from '../layout/Layout'
import { useSelector } from 'react-redux'

const ProductDescriptionPage = ({ slug }) => {
    const router = useRouter()
    const language = useSelector(state => state.Language.selectedLanguage)
    const effectiveSlug = slug || router.query?.slug || ''

    useEffect(() => { }, [language?.id])
    return (
        <Layout>
            <ProductDescription slug={effectiveSlug} />
        </Layout>
    )
}

export default ProductDescriptionPage