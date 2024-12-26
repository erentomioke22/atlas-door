import { NextResponse } from "next/server"


export function middleware(req){
    const session  = req.cookies.get("authjs.session-token");
    if(session){
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/NotFound",req.url))      
}


export const config = {
    matcher:["/profile","/profile/savenews","/profile/edit-profile","/admin/news",]
}


// export { auth as middleware } from "@/auth"
