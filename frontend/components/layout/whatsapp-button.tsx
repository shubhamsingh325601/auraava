"use client"

import { waLink } from "@/lib/site-config"

export default function WhatsAppButton() {
    return (
        <a
            href={waLink("Hi Auraava, I'd love to know more about your products.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[70] w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg grid place-items-center hover:scale-105 transition-transform"
        >
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75" />
            <svg
                viewBox="0 0 32 32"
                className="relative w-7 h-7 fill-current"
                aria-hidden="true"
            >
                <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.372.66 4.59 1.804 6.482L4 29l7.71-1.766A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75c-1.97 0-3.808-.57-5.353-1.553l-.384-.24-4.577 1.048 1.06-4.463-.252-.396A9.71 9.71 0 0 1 5.25 15c0-5.93 4.822-10.75 10.754-10.75S26.75 9.07 26.75 15 21.936 24.75 16.004 24.75Zm5.94-7.86c-.324-.163-1.916-.946-2.213-1.054-.297-.108-.514-.163-.73.163-.216.325-.837 1.054-1.027 1.271-.19.217-.378.244-.703.081-.324-.163-1.368-.505-2.606-1.614-.963-.86-1.613-1.923-1.802-2.248-.19-.325-.02-.5.143-.663.146-.146.324-.38.487-.57.163-.19.216-.325.324-.542.108-.217.054-.407-.027-.57-.081-.163-.73-1.76-1.001-2.41-.264-.633-.532-.547-.73-.557l-.622-.011c-.216 0-.568.081-.865.407-.297.325-1.135 1.108-1.135 2.704 0 1.596 1.162 3.138 1.324 3.355.163.217 2.288 3.495 5.542 4.9.774.334 1.377.534 1.848.684.776.247 1.483.212 2.042.129.623-.093 1.916-.783 2.187-1.539.27-.756.27-1.404.19-1.539-.081-.136-.298-.217-.622-.38Z" />
            </svg>
        </a>
    )
}
