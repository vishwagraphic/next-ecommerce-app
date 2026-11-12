import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import { getAllProducts, getAllCategories } from "@/lib/actions/product.actions";
import Link from "next/link";


const prices = [
    { label: 'Under $50', value: '1-50' },
    { label: '$50 to $100', value: '50-100' },
    { label: '$100 to $200', value: '100-200' },
    { label: 'Over $200', value: 'over-200' }
];

const ratings = [
    { label: '4 & up', value: '4' },
    { label: '3 & up', value: '3' },
    { label: '2 & up', value: '2' },
    { label: '1 & up', value: '1' }
];

const sortOrders = [
    { label: 'Newest', value: 'newest' },
    { label: 'Lowest Price', value: 'lowest' },
    { label: 'Highest Price', value: 'highest' },
    { label: 'Rating', value: 'rating' }
];

export async function generateMetadata(props:{
        searchParams: Promise<{ query: string, category?: string, price?: string, rating?: string }>
}) {

    const { query='all', category='all', price='all', rating='all' } = await props.searchParams;

    const isQuerySet =  query && query !== 'all' && query.trim() !== '';
    const isCategorySet = category && category !== 'all' && category.trim() !== '';
    const isPriceSet = price && price !== 'all' && price.trim() !== '';
    const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';
    if (!isQuerySet && !isCategorySet && !isPriceSet && !isRatingSet) {
        return {
            title: 'Search Products',
        };
    }
    return {
        title: ` Search Results for "${isQuerySet ? `Query: ${query}` : ''} ${isCategorySet ? `Category: ${category}` : ''} ${isPriceSet ? `Price: ${price}` : ''} ${isRatingSet ? `Rating: ${rating}` : ''}"`
    };
}

const SearchPage = async (props: { searchParams: Promise<
    { query?: string; category?: string, price?: string, rating?: string, sort?: string, page?: string }
> }) => {

    const { query='all', category='all', price='all', rating='all', sort='newest', page='1' } = await props.searchParams;
    
    const getFilteredUrl = ({q, c, p, r, s, pg}: {q?: string, c?: string, p?: string, r?: string, s?: string, pg?: string}) => {
        const params = {
            query,
            category,
            price,
            rating,
            sort,
            page: Number(page)
        }
        if (q) params.query = q;
        if (c) params.category = c;
        if (p) params.price = p;
        if (r) params.rating = r;
        if (s) params.sort = s;
        if (pg) params.page = Number(pg);
        const searchParams = new URLSearchParams(params as any);
        return `/search?${searchParams.toString()}`;
    };
    
    const products = await getAllProducts({ query, category, price, rating, sort, page: Number(page) });

    const categories = await getAllCategories();

    console.log('Search params:', { query, category, price, rating, sort, page });

    return ( 
        <div className="grid md:grid-cols-5 md:gap-5">
            <div className="filter-links">
                <div className="text-xl mb-2 mt-3">
                    Department
                </div>
                <div>
                    <ul className="space-y-1">
                        {categories?.data?.map((x) => (
                            <li key={x.category}>
                                <Link className={`${(x.category == 'all' || x.category == '' ? 'font-bold' : '')}`} 
                                href={getFilteredUrl({ c: 'all' })}>Any</Link>
                            </li>
                        ))}
                        {categories?.data?.map((x) => (
                            <li key={x.category}>
                                <Link className={`${(category == x.category ? 'font-bold' : '')}`} 
                                href={getFilteredUrl({ c: x.category as string })}>{x.category}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="text-xl mb-2 mt-5">
                    Price
                </div>
                <div>
                    <ul className="space-y-1">
                         
                        <li >
                            <Link className={`${(price== 'all' ? 'font-bold' : '')}`} 
                            href={getFilteredUrl({ p: 'all' })}>Any</Link>
                        </li>
                        
                        {prices.map((p) => (
                            <li key={p.value}>
                                <Link className={`${(p.value == price ? 'font-bold' : '')}`} 
                                href={getFilteredUrl({ p: p.value })}>{p.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>


                  <div className="text-xl mb-2 mt-5">
                    Rating
                </div>
                <div>
                    <ul className="space-y-1">
                         
                        <li >
                            <Link className={`${(rating== 'all' ? 'font-bold' : '')}`} 
                            href={getFilteredUrl({ r: 'all' })}>Any</Link>
                        </li>
                        
                        {ratings.map((r) => (
                            <li key={r.value}>
                                <Link className={`${(r.value == rating ? 'font-bold' : '')}`} 
                                href={getFilteredUrl({ r: r.value })}>{r.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

             
            <div className="md:col-span-4 space-y-4">
                <div className="flex-between flex-col md:flex-row my-4">
                    <div className="flex items-center">
                    { query !== 'all' && query !== '' && `Query: ${query}`} {' '}
                    { category !== 'all' && category !== '' && `Category: ${category}`}{' '}
                    { price !== 'all' && price !== '' && `Price: ${price}`}{'  '}
                    { rating !== 'all' && rating !== '' && `Rating: ${rating}`}
                    &nbsp;
                    { (query !== 'all' && query !== '' || category !== 'all' && category !== '' || price !== 'all' && price !== '' || rating !== 'all' && rating !== '') ? 
                    <Button>
                        <Link href="/search">Clear Filters</Link>
                    </Button>
                     : '' }
                    </div>
                    <div>
                        Sort By:
                        {sortOrders.map((s) => (
                            <Link key={s.value} href={getFilteredUrl({ s: s.value })} className={`${(s.value == sort ? 'font-bold' : '')}`}>
                                {s.label} {' '}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {products.data.length === 0 && <p>No products found.</p>}
                    {
                        products.data.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product as any}
                            />
                        ))
                    }
                </div>
            </div>
            
        </div> 
    );
}
 
export default SearchPage;