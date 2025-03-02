import { Button } from '@/components/ui/button'
import { Link2Icon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

type Props = {
  videoId: string
  className?: string
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
}

const CopyLink = ({ videoId, className, variant }: Props) => {
  const onCopyClipboard = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_HOST_URL}/video/${videoId}`
    )
    toast('Copied', {
      description: 'Link successfully copied',
    })
  }

  return (
    <Button
      variant={variant}
      onClick={onCopyClipboard}
      className={className}
    >
      <Link2Icon /* className='text-white' *//>
    </Button>
  )
}

export default CopyLink
