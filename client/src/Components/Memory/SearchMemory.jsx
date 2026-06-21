import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineSearch } from "react-icons/md";

function SearchMemory({ onSearch, setFetchAll }){

    const [query, setQuery] = useState("");

    const handleChangeInQuery = (e) => {
        const val = e.target.value;
        setQuery(val);
        if(val.length === 0){
            setFetchAll(true);
        }
    }

    const handleSearchMemory = (e) => {
        e.preventDefault();
        if(!query){
            toast.error("Search query not found !!");
            return;
        }
        onSearch(query);

    }

    return(
        <div className="relative mt-10" id="input">
            <form onSubmit={handleSearchMemory} >
                <input 
                    type="text" 
                    value={query}
                    onChange={handleChangeInQuery}
                    placeholder="Enter Memory title or category or tags to start searching"
                    className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-slate-200 appearance-none focus:border-transparent focus:outline focus:outline-2 focus:outline-primary focus:ring-0 hover:border-brand-500-secondary peer invalid:border-error-500 invalid:focus:border-error-500 overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"

                />
                <button className="absolute top-3 right-3">
                    <MdOutlineSearch className="text-3xl" />
                </button>
            </form>
        </div>
    )
}


export default SearchMemory;


