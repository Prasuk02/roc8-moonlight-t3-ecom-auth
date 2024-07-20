"use client";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import Loader from "~/app/_components/Loader";
import Pagination from "~/app/_components/Pagination";
import { api } from "~/trpc/react";

interface ICategories {
  id: string;
  name: string;
}

const page = () => {
  // API call to fetch all categories from the db
  const { data: fetchCategoriesData, isFetched: isAllCategoriesFetched } =
    api.category.fetchAllCategories.useQuery();

  // API call to add user new interested category
  const addUserInterestedCategories =
    api.interestedCategory.addUserInterestedCategories.useMutation({
      onSuccess: ({ message }) => {
        toast.success(message);
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    });

  // API call to remove user interested category
  const removeUserInterestedCategories =
    api.interestedCategory.removeUserInterestedCategories.useMutation({
      onSuccess: ({ message }) => {
        toast.success(message);
      },
      onError: ({ message }) => {
        toast.error(message);
      },
    });

  // useStates
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [allCategories, setAllCategories] = useState<ICategories[]>([]);
  const [userInterestedCategories, setUserInterestedCategories] = useState<{ [key: string]: boolean }>({});

  const setPageCategories = (pageCategories: ICategories[]) => {
    setCategories(pageCategories);
  };

  useEffect(() => {
    if (isAllCategoriesFetched) {
      const fetchedCategories = fetchCategoriesData?.data.allCategories
      setAllCategories(fetchedCategories || []);
  
      const userSelectedCategories = fetchCategoriesData?.data?.userInterestedCategories?.categoryIds;
      
      if (userSelectedCategories?.length) {
        const mapCategories = userSelectedCategories.reduce((acc: any, categoryId) => {
          acc[categoryId] = true;
          return acc;
        }, {});
        
        setUserInterestedCategories(mapCategories);
      }
    }
  }, [fetchCategoriesData]);

  const updateuserInterestedCategories = (categoryId: string) => {
    let updatedCategories = { ...userInterestedCategories };
  
    if (userInterestedCategories[categoryId]) {
      // If the category is already in the user's interested categories, remove it
      delete updatedCategories[categoryId];
      setUserInterestedCategories(updatedCategories);
      
      // Trigger mutation to update the backend, removing the category from user's interested categories
      removeUserInterestedCategories.mutate({ ids: Object.keys(updatedCategories) });
    } 
    else {
      // If the category is not in the user's interested categories, add it
      updatedCategories = { ...updatedCategories, [categoryId]: true };
      setUserInterestedCategories(updatedCategories);
      
      // Trigger mutation to update the backend, adding the category to user's interested categories
      addUserInterestedCategories.mutate({ id: categoryId });
    }
  };

  return (
    <>
      <Toaster richColors />
      <main className="flex h-full w-full items-start justify-center pt-8">
        <div className="w-[430px] rounded-2xl border-[1px] border-[#c1c1c1] px-10 py-7">
          <h2 className="text-center text-2xl font-bold">
            Please mark your interests!
          </h2>

          <p className="mt-5 text-center text-sm">
            We will keep you notified.
          </p>

          <h3 className="mt-6 text-lg font-semibold">
            My saved interests!
          </h3>

          <div className="relative min-h-[220px]">
            {categories.length ? (
              // Display list of categories with checkboxes
              categories.map((category) => (
                <div key={category.id} className="mt-5 flex items-center gap-[10px]">
                  <input
                    className="h-5 w-5 cursor-pointer accent-black"
                    type="checkbox"
                    checked={userInterestedCategories[category.id] === true}
                    id={category.name}
                    onChange={() => updateuserInterestedCategories(category.id)} // Update user interested categories on checkbox change
                  />
                  <label
                    htmlFor={category.name}
                    className="text-sm font-medium"
                  >
                    {category.name}
                  </label>
                </div>
              ))
            ) : (
              // Show a loading spinner and message if no categories are available
              <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                <Loader />
                <p className="mt-2 text-center text-xs font-medium">
                  Fetching Categories, Please wait...
                </p>
              </div>
            )}
          </div>

          {isAllCategoriesFetched && allCategories.length > 0 && (
            // Render pagination component if all categories are fetched and there are categories to display
            <Pagination
              items={allCategories}
              itemsPerPage={6}
              onPaginate={setPageCategories}
            />
          )}
        </div>
      </main>
    </>
  );
};

export default page;
