'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { useForm } from 'react-hook-form';
import { accountSchema } from '@/app/lib/schema';
import { Input } from './ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import useFetch from '@/hooks/user-fetch';
import { createAccount } from '@/actions/dashboard';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CreateAccountDrawer = ({children}) => {

    const[open, setOpen] = useState(false);
    const {register,handleSubmit,formState:{errors},setValue,watch,reset} = useForm({
        resolver:zodResolver(accountSchema),
        defaultValues:{
            name:'',
            type:'SAVINGS',
            balance:'',
            isDefault:false
        }
    })

    const onSubmit = async (data) => {      
              await createAccountFn(data);
    };
    const {data:newAccount, error,fn:createAccountFn,loading:createAccountLoading}= useFetch(createAccount);

    useEffect(() => {   
        if(newAccount && !createAccountLoading){
            toast.success("Account Created Successfully ")
            reset();
            setOpen(false);
        }               
    }
    ,[newAccount ,createAccountLoading])

    useEffect(() => {   
        if(error){
        toast.error(error.message || "Failed to create account");
        }               
    }
    ,[error])

  return (
    <div>
        <Drawer open={open} onOpenChange={setOpen}>
    <DrawerTrigger>{children}</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Create New Account</DrawerTitle>
      </DrawerHeader>

      <div className='px4 pb-4'>
        <form className='space-y-4'  onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-2'>

 <label className='text-sm font-medium' htmlFor="name">Account Name</label>
            <Input id='name' placeholder= "e.g., Main Checking"
            {...register('name')}
            
            
            />

            {errors.name &&( <p className='text-red-500'>{errors.name.message}</p>)}
           
            </div>
           
            <div className='space-y-2'>

 <label className='text-sm font-medium' htmlFor="type">Account Type</label>
 <Select onValueChange={(value) => setValue('type', value)} defaultValue={watch('type')}>
  <SelectTrigger id='type'>
    <SelectValue placeholder="Select Type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="CURRENT">Current</SelectItem>
    <SelectItem value="SAVINGS">Savings</SelectItem>
   
  </SelectContent>
</Select>

            {errors.type &&( <p className='text-red-500'>{errors.type.message}</p>)}
           
            </div>
           
            <div className='space-y-2'>

<label className='text-sm font-medium' htmlFor="balance">Initial Balance</label>
           <Input 
           id='name'
           placeholder= "0.00"
           step="0.01"
            type="number"

           {...register('balance')}
           
           
           />

           {errors.balance &&( <p className='text-red-500'>{errors.balance.message}</p>)}
          

           </div>

            <div className='flex items-center justify-between rounded-lg border p-3'>
             <div className='space-y-0.5'>

               <label className='text-sm font-medium cursor-pointer' htmlFor="balance"> Set as Default</label>
            <p className='text-sm text-muted-foreground'>This account will be selected by default for transactijons</p> 
             </div>

            <Switch 
            id='isDefault' 
             onCheckedChange={(checked) => setValue('isDefault', checked)} defaultValue={watch('isDefault')}
            
            />
          
           </div>

           <div className='flex gap-4 pt-4'>
            <DrawerClose asChild>
                <Button type='button' variant='outline' className='flex-1'>Cancel</Button>

            </DrawerClose>

            <Button type='submit' className='flex-1' disabled={createAccountLoading}>
                {createAccountLoading ? <><Loader2 className='mr-2 h-4 animate-spin' /> Creating...</> : 'Create Account'}
                </Button>
           </div>


        </form>
      </div>
    </DrawerContent>
  </Drawer></div>
  )
}

export default CreateAccountDrawer