import {useState} from 'react'



const useTagInput = (maxTags) => {
    const [tags, setTags] = useState([]);
    const handleAddTag = (newTag) => {
        if (newTag && !tags.includes(newTag) && tags.length < maxTags) {
          setTags([...dropTag, newTag]);
        }
      };
    
      const handleRemoveTag = (tag) => {
        setTags(tags.filter((t) => t !== tag));
      };

      return { tags, handleAddTag, handleRemoveTag };
}

export default useTagInput