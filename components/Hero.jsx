'use client'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

const HeroSection = () => {
    const imageRef=useRef()
    useEffect(()=>{
        const imageElement = imageRef.current;
        const handleScroll = () => {
            const scrollPosition =window.scrollY;
            const scrollThreshold = 100;
            if(scrollPosition > scrollThreshold){
                imageElement.classList.add('scrolled');
            }
            else{
                imageElement.classList.remove('scrolled');
    
            };
          };

        window.addEventListener('scroll',handleScroll)
        return()=>window.removeEventListener("scroll",handleScroll)
    },[])

  return (
    <div className='pb-20 px-4 overflow-hidden'>
        <div className='container mx-auto text-center'>
            <h1 className='text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title'>
                Manage Your Finances <br />With Intelligence
            </h1>
            <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
                An AI Powered financial management platform that helps you track, analyaze, and optimize your spending with real-time insigts.
            </p>
        </div>
        <div className='flex justify-center space-x-4'>
            <Link href='/dashboard'>
            <Button size='lg' className='px-8'>
                Get Started
            </Button>
            </Link>
            <Link href='https://www.youtube.com/watch?v=cjLV7j4rlSA'>
            <Button size='lg' className='px-8' variant='outline' >
                Get Started
            </Button>
            </Link>

        </div>
        <div className='hero-image-wrapper flex '>
            <div  ref={imageRef} className='hero-image w-2/3'>
                <Image src='/banner.jpg' height={720} width={1280} alt='Dashboard Preview' className='rounded-lg shadow-2xl border mx-auto' priority />
            </div> 
            <div className='w-1/3 flex items-center'>
            <h1 className='text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title'>
                Manage Your Finances <br />With Intelligence
            </h1>
             

            </div>
        </div>
        
        
    </div>
  )
}

export default HeroSection