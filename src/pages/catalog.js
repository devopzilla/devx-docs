import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

export default function Catalog() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const response = await fetch("https://devxhub.guku.io/api/catalog/public");
            const result = await response.json()

            setData(result);
            setIsLoading(false);
        };

        fetchData();
    }, []);

    return (
        <Layout title="Catalog" description="DevX Catalog Page">
            <div className="container">
                {isLoading ? (
                    <div>Loading ...</div>
                ) : (
                    <div className="flex gap-2 flex-wrap mt-5">
                        {
                            data.map(item => (
                                <div key={item.id} className=" border-4 border-black p-4 shadow-lg rounded text-gray-700">
                                    <h3>{item.name}</h3>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
        </Layout>
    );
}