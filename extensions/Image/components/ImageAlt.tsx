// import { memo, useCallback, useEffect, useState } from 'react'
// import Dropdown from '@components/ui/dropdown'
// import Input from '@components/ui/input'
// import Button from '@components/ui/button'
// import { BsFillFileRichtextFill } from "react-icons/bs";

// export const ImageAlt = memo(({ onChange, value }) => {
// const [altText,setAltText]=useState('')

//   return (
//     <Dropdown className="right-0 px-2  rounded-lg w-44" title={<BsFillFileRichtextFill/>} btnStyle={'text-white dark:text-black p-1 my-auto text-xl my-auto '}>
//       <div className='space-y-1 '>
//       <Input
//         id="altText"
//         type="text"
//         title="Alt Text"
//         label={true}
//         value={altText}
//         onChange={(e) => setAltText(e.target.value)}
//         className=""
//         placeholder="Enter alt text"
//       />
//       <Button variant='menuActive' className=' w-full py-1 text-sm rounded-lg' onClick={()=>{onChange(altText);}} type='button'>
//         Set Alt Text
//       </Button>
//       </div>
//     </Dropdown>
//   )
// })

// ImageAlt.displayName = 'ImageAlt'

import { memo, useCallback, useEffect, useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { BsFillFileRichtextFill } from "react-icons/bs";

interface ImageAltProps {
  onChange: (value: string) => void;
  value?: string;
}

export const ImageAlt = memo<ImageAltProps>(({ onChange, value }) => {
  const [altText, setAltText] = useState(value || "");

  useEffect(() => {
    setAltText(value || "");
  }, [value]);

  return (
    <Dropdown
      className="right-0 px-2  rounded-lg w-44"
      title={<BsFillFileRichtextFill />}
      btnStyle={"text-white dark:text-black p-1 my-auto text-xl my-auto "}
    >
      <div className="space-y-1 ">
        <Input
          id="altText"
          type="text"
          title="Alt Text"
          label={true}
          value={altText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAltText(e.target.value)
          }
          className=""
          placeholder="Enter alt text"
        />
        <Button
          variant="menuActive"
          className=" w-full py-1 text-sm rounded-lg"
          onClick={() => {
            onChange(altText);
          }}
          type="button"
        >
          Set Alt Text
        </Button>
      </div>
    </Dropdown>
  );
});

ImageAlt.displayName = "ImageAlt";
