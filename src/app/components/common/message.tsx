import React from 'react'
import { Callout } from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons'

function Message({ message }: { message: string }) {

  return (
    <Callout.Root color="red">
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>
        {message}
      </Callout.Text>
    </Callout.Root>
  )
}

export default Message

