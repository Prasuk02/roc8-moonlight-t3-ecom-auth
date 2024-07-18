'use client';
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type Props = {
  items: any[];
  itemsPerPage: number;
  onPaginate: (pageData: any) => void;
};

const Pagination = ({ items, itemsPerPage, onPaginate }: Props) => {
  const [ currentPage, setCurrentPage ] = useState(1)
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginationTabRange = 7;

  useEffect(() => {
    onPaginate(items.slice((currentPage - 1) * itemsPerPage, ((currentPage - 1) * itemsPerPage) + itemsPerPage))
  }, [currentPage])

  const moveToPreviousPage = () => {
    if (currentPage <= 1) {
      return;
    }
    setCurrentPage(currentPage - 1);
  }

  const moveToNextPage = () => {
    if (currentPage >= totalPages) {
      return;
    }
    setCurrentPage(currentPage + 1);
  }

  const moveToFirstPage = () => {
    setCurrentPage(1);
  }

  const moveToLastPage = () => {
    setCurrentPage(totalPages);
  }

  return (
    <div className="mt-8 flex items-center justify-center text-sm text-[#acacac] gap-3 font-medium">
      <ChevronsLeft 
        size={22} 
        strokeWidth={1.75} 
        onClick={ moveToFirstPage }
        className="cursor-pointer"
      />

      <ChevronLeft 
        size={20} 
        strokeWidth={1.75} 
        onClick={ moveToPreviousPage }
        className="cursor-pointer"
      />

      { currentPage >= paginationTabRange &&
        <p className="tracking-widest">...</p>
      }

      {new Array(totalPages)
        .fill(0)
        .map((value, idx) => idx + 1)
        .slice( currentPage >= paginationTabRange ? currentPage - paginationTabRange + 1 : 0 , currentPage >= paginationTabRange ? currentPage + 1 : paginationTabRange)
        .map((value, key) => {
          return (
            <>
              <p
                className={`${currentPage === value && "text-black"} cursor-pointer`}
                key={key}
                onClick={() => setCurrentPage(value)}
              >
                {value}
              </p>
            </>
          );
        })}
      
      { currentPage + 1 < totalPages &&
        <p className="tracking-widest">...</p>
      }

      <ChevronRight 
        size={20} 
        strokeWidth={1.75} 
        onClick={ moveToNextPage }
        className="cursor-pointer"
      />

      <ChevronsRight 
        size={22} 
        strokeWidth={1.75} 
        onClick={ moveToLastPage }
        className="cursor-pointer"
      />
    </div>
  );
};

export default Pagination;
