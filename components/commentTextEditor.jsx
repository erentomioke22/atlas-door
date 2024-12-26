'use client'



import { useEditor, EditorContent } from '@tiptap/react'
import { Color } from '@tiptap/extension-color'
import StarterKit from '@tiptap/starter-kit'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import React,{forwardRef, useEffect} from 'react'
import  {Emoji , gitHubEmojis } from '@tiptap-pro/extension-emoji'
import Dropdown from './ui/dropdown'
import { BsEmojiSmile } from "react-icons/bs";
import { emojiSuggestion } from '@extensions'

const CommentTextEditor = forwardRef(({content,onChange,title},ref) => {
  
  // const emojies = [
  //   { emoji: '😭', name: 'sob' },
  //   { emoji: '😍', name: 'heart_eyes' },
  //   { emoji: '😜', name: 'stuck_out_tongue_winking_eye' },
  //   { emoji: '😱', name: 'scream' },
  //   { emoji: '😃', name: 'smiley' }, 
  //   { emoji: '😁', name: 'grin' }, 
  //   { emoji: '😆', name: 'laughing' }, 
  //   { emoji: '😅', name: 'sweat_smile' }, 
  //   { emoji: '🤣', name: 'rofl' }, 
  //   { emoji: '😏', name: 'smirk' }, 
  //   { emoji: '😉', name: 'wink' }, 
  //   { emoji: '😘', name: 'kissing_heart' }, 
  //   { emoji: '😗', name: 'kissing' }, 
  //   { emoji: '😚', name: 'kissing_closed_eyes' }, 
  //   { emoji: '😋', name: 'yum' }, 
  //   { emoji: '😛', name: 'stuck_out_tongue' }, 
  //   { emoji: '😝', name: 'stuck_out_tongue_closed_eyes' }, 
  //   { emoji: '🤑', name: 'money_mouth_face' }, 
  //   { emoji: '🤗', name: 'hugs' }, 
  //   { emoji: '🤐', name: 'zipper_mouth_face' }, 
  //   { emoji: '🤨', name: 'face_with_raised_eyebrow' },
  //   { emoji: '😐', name: 'neutral_face' }, 
  //   { emoji: '😑', name: 'expressionless' }, 
  //   { emoji: '😶', name: 'no_mouth' }, 
  //   { emoji: '🙄', name: 'rolling_eyes' }, 
  //   { emoji: '🥰', name: 'smiling_face_with_three_hearts' }, 
  //   { emoji: '🤯', name: 'exploding_head' }, 
  //   { emoji: '🥳', name: 'partying_face' }, 
  //   { emoji: '🤓', name: 'nerd_face' }, 
  //   { emoji: '😇', name: 'innocent' }, 
  //   { emoji: '🤕', name: 'face_with_head_bandage' }, 
  //   { emoji: '🤒', name: 'face_with_thermometer' }, 
  //   { emoji: '😴', name: 'sleeping' }, 
  //   { emoji: '😊', name: 'blush' },
  //   { emoji: '😠', name: 'angry' },
  //   { emoji: '😂', name: 'joy' },
  //   { emoji: '😢', name: 'cry' },
  //   { emoji: '🤔', name: 'thinking' },
  //   { emoji: '😎', name: 'sunglasses' },
  //   { emoji: '🤷‍♂️', name: 'man_shrugging' },
  //   { emoji: '🤷‍♀️', name: 'woman_shrugging' },
  //   { emoji: '🙈', name: 'see_no_evil' },
  //   { emoji: '🙉', name: 'hear_no_evil' },
  //   { emoji: '🙊', name: 'speak_no_evil' },
  //   { emoji: '🤖', name: 'robot' },
  //   { emoji: '💀', name: 'skull' },
  //   { emoji: '💪', name: 'muscle' },
  //   { emoji: '🙌', name: 'raised_hands' },
  //   { emoji: '👍', name: 'thumbsup' },
  //   { emoji: '👎', name: 'thumbsdown' },
  //   { emoji: '👋', name: 'wave' }, 
  //   { emoji: '🙏', name: 'pray' },
  //   { emoji: '👏', name: 'clapping_hands' },
  //   { emoji: '👌', name: 'ok_hand' },
  //   { emoji: '✌️', name: 'victory' }, 
  //   { emoji: '🤚', name: 'raised_hand' }, 
  //   { emoji: '🤝', name: 'handshake' }, 
  //   { emoji: '🤲', name: 'palms_up_together' }, 
  //   { emoji: '👐', name: 'open_hands' }, 
  //   { emoji: '🔥', name: 'fire' },
  //   { emoji: '💖', name: 'sparkling_heart' },
  //   { emoji: '💔', name: 'broken_heart' },
  //   { emoji: '💫', name: 'dizzy' }, 
  //   { emoji: '✨', name: 'sparkles' },
  //   { emoji: '⚡', name: 'zap' },
  //   { emoji: '🌟', name: 'glowing_star' },
  //   { emoji: '⭐', name: 'star' },
  //   { emoji: '💤', name: 'zzz' }, 
  //   { emoji: '💩', name: 'poop' }, 
    
  //   // { emoji: '☺️', name: 'relaxed' }, 
    
  //   { emoji: '✅', name: 'check_mark_button' },
  //   { emoji: '❌', name: 'cross_mark' },
  //   { emoji: '🎉', name: 'tada' },
  //   { emoji: '🚀', name: 'rocket' },
  //   { emoji: '💡', name: 'bulb' },
  //   { emoji: '🎂', name: 'birthday' },
  //   { emoji: '🌈', name: 'rainbow' },
  //   { emoji: '🌞', name: 'sun_with_face' },
  //   { emoji: '🌙', name: 'moon' },
  //   { emoji: '💃', name: 'dancer' },
  //   { emoji: '🕺', name: 'man_dancing' },
  //   { emoji: '🚨', name: 'rotating_light' },
  //   { emoji: '📌', name: 'pushpin' },
  //   { emoji: '🔒', name: 'lock' },
  //   { emoji: '🔑', name: 'key' },
  //   { emoji: '⌛', name: 'hourglass' },
  //   // { emoji: '⚠️', name: 'warning' },
  //   // { emoji: '❗', name: 'exclamation_mark'},
  //   // { emoji: '❕', name: 'white_exclamation_mark' },
  //   // { emoji: '📎', name: 'paperclip' },
  //   // { emoji: '🗝️', name: 'old_key' },

    
  //   // { emoji: '✈️', name: 'airplane' },
  //   // { emoji: '✅', name: 'white_check_mark' },
  //   // { emoji: '⚽', name: 'soccer' },
  //   // { emoji: '🍕', name: 'pizza' },
  //   // { emoji: '🎈', name: 'balloon' },
  //   // { emoji: '🌊', name: 'ocean' },
  //   // { emoji: '🌳', name: 'tree' },
  //   // { emoji: '🛴', name: 'scooter' },
  //   // { emoji: '🧠', name: 'brain' },
  //   // { emoji: '🎨', name: 'palette' },
  //   // { emoji: '📚', name: 'books' },
  //   // { emoji: '🎧', name: 'headphones' },
  //   // { emoji: '🎤', name: 'microphone' },
  //   // { emoji: '🎸', name: 'guitar' },
  //   // { emoji: '🕶️', name: 'sunglasses' },
  //   // { emoji: '🏆', name: 'trophy' },
  //   // { emoji: '🍔', name: 'burger' },
  //   // { emoji: '🍣', name: 'sushi' },
  //   // { emoji: '🍎', name: 'apple' },
  //   // { emoji: '🍪', name: 'cookie' },
  //   // { emoji: '👻', name: 'ghost' },
  //   // { emoji: '👽', name: 'alien' },
  //   // { emoji: '💬', name: 'speech_balloon' },
  //   // { emoji: '📝', name: 'memo' },
  //   // { emoji: '📅', name: 'calendar' },
  //   // { emoji: '✂️', name: 'scissors' },
  //   // { emoji: '🔨', name: 'hammer' },
  //   // { emoji: '⚙️', name: 'gear' },
  //   // { emoji: '🛠️', name: 'hammer_and_wrench' },
  //   // { emoji: '🚧', name: 'construction' },
  //   // { emoji: '💉', name: 'syringe' },
  //   // { emoji: '💊', name: 'pill' },
  //   // { emoji: '🚪', name: 'door' },
  //   // { emoji: '🛏️', name: 'bed' },
  //   // { emoji: '🧳', name: 'luggage' },
  //   // { emoji: '🕰️', name: 'mantelpiece_clock' },
  //   // { emoji: '⏳', name: 'hourglass_flowing_sand' },
  //   // { emoji: '⌚', name: 'watch' },
  //   // { emoji: '⏰', name: 'alarm_clock' },
  //   // { emoji: '📱', name: 'mobile_phone' },
  //   // { emoji: '💻', name: 'laptop' },
  //   // { emoji: '🖥️', name: 'desktop_computer' },
  //   // { emoji: '💡', name: 'light_bulb' },
  //   // { emoji: '🔌', name: 'electric_plug' },
  //   // { emoji: '🔋', name: 'battery' },
  //   // { emoji: '🕹️', name: 'joystick' },
  //   // { emoji: '🛒', name: 'shopping_cart' },


  // ];


  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      Link.configure({openOnClick: false,autolink: true,defaultProtocol: 'https',}),
      Placeholder.configure({
        placeholder: 'Write Something ...',
      }),
      // Emoji.configure({
      //   emojis: gitHubEmojis,
      //   enableEmoticons: true,
      //   emojiSuggestion,
      // }),
  Emoji.configure({
    enableEmoticons: true,
    suggestion: emojiSuggestion,
  }),
    ],
    editorProps:{
        attributes:{
             class: "  w-full p-2 text-sm  focus:outline-none focus:ring-0 rounded-lg duration-200  ",
            spellcheck: 'false',
        },
    },
    
    // content:content,

    onUpdate:({editor})=>{
      onChange(editor.getHTML())
    },
  })


  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
        <div className=' bg-white dark:bg-black border  rounded-lg border-lbtn dark:border-dbtn pl-2 break-all hyphens-auto text-wrap'>
        {/* <CommentToolbar editor={editor} content={content}/> */}
           <EditorContent style={{whiteSpace:"pre-line"}} editor={editor} ref={ref} />
         {/* <Dropdown title={<BsEmojiSmile/>} btnStyle={'text-lfont text-lg mt-3 '} className={'left-0 w-48 mt-1  bg-white border border-lbtn dark:border-dbtn px-2 rounded-lg'}>
         <div className="grid grid-cols-8 gap-2 text-sm">
           {emojies.map((emoji)=>(
             <button onClick={() => editor.chain().focus().setEmoji(emoji.name).run()} type='button'>{emoji.emoji}</button>
           ))}
          </div>
         </Dropdown> */}
       </div>
  )
})
CommentTextEditor.displayName = 'CommentTextEditor'; 
export default CommentTextEditor;