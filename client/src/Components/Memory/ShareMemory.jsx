import React from 'react';
import toast from 'react-hot-toast';
import { FaRegShareSquare } from 'react-icons/fa';


function ShareMemory({ memoryId }){

    function copyToClipboard(){
        navigator.clipboard.writeText(`${window.location.origin}/memory/${memoryId}`);
        toast.success("Memory Link copied successfully")
    }

    return(
        <div className='relative group'>
            <button onClick={copyToClipboard} className='flex items-center space-x-2'>
                <FaRegShareSquare className='text-blue-500' />
                <span>Share Memory</span>
            </button>
            <div className='absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2'>
                Copy link to memory
            </div>
        </div>
    )
}

export default ShareMemory;