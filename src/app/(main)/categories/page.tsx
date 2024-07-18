"use client";
import React, { useEffect, useState } from "react";
import Loader from "~/app/_components/Loader";
import Pagination from "~/app/_components/Pagination";
import { api } from '~/trpc/react';

type Props = {};

interface Categories {
  id: string;
  name: string;
  interestedCategoryId: string | null;
}

const page = (props: Props) => {
  const { data: fetchCategoriesData, isFetched: isAllCategoriesFetched } = api.category.fetchAllCategories.useQuery()
  const [ categories, setCategories ] = useState<Categories[]>([]);
  const [ allCategories, setAllCategories ] = useState<Categories[]>([]);
  const [ selectedCategories, setSelectedCategories ] = useState<String[]>([]);

  const setPageCategories = (pageCategories: React.SetStateAction<Categories[]>) => {
    setCategories(pageCategories);
  };

  useEffect(() => {
    if (isAllCategoriesFetched) {
      setAllCategories(fetchCategoriesData?.data || [])
    }
  }, [fetchCategoriesData])

  const updateSelectedCategories = (category: string) => {
    const updatedCategories = [...selectedCategories, category];
    setSelectedCategories(updatedCategories);
  }

  return (
    <main className="flex h-full w-full items-start justify-center pt-8">
      <div className="w-[430px] rounded-2xl border-[1px] border-[#c1c1c1] px-10 py-7">
        <h2 className="text-center text-2xl font-bold">
          Please mark your interests!
        </h2>

        <p className="mt-5 text-center text-sm">We will keep you notified.</p>

        <h3 className="mt-6 text-lg font-semibold">My saved interests!</h3>

        <div className="min-h-[220px] relative">
          {categories.length ? (
            categories.map((category, key) => {
              return (
                <div key={key} className="mt-5 flex items-center gap-[10px]">
                  <input
                    className="h-5 w-5 cursor-pointer accent-black"
                    type="checkbox"
                    checked={ selectedCategories.includes(category.name) }
                    id={category.name}
                    onClick={ () => updateSelectedCategories(category.name) }
                  />
                  <label
                    htmlFor={category.name}
                    className="text-sm font-medium"
                  >
                    {category.name}
                  </label>
                </div>
              );
            })
          ) : (
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
              <Loader />
              <p className="mt-2 text-center text-xs font-medium">
                Fetching Categories, Please wait...
              </p>
            </div>
          )}
        </div>

        {isAllCategoriesFetched && allCategories?.length && (
          <Pagination
            items={allCategories}
            itemsPerPage={6}
            onPaginate={setPageCategories}
          />
        )}
      </div>
    </main>
  );
};

export default page;
