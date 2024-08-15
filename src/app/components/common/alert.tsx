import React from 'react'
import { AlertDialog, Flex, Button } from '@radix-ui/themes'
const Alert = (
    { title, text, id, children, handleOk, handleCancel }: { title: string, text: string, id?: string, children: React.ReactNode, handleOk: (id: string | undefined) => void, handleCancel: () => void }
) => {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                {children}
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title>{title}</AlertDialog.Title>
                <AlertDialog.Description size="2">
                    {text}
                </AlertDialog.Description>
                <Flex gap="3" mt="4" justify="end">
                    <AlertDialog.Cancel>
                        <Button variant="soft" color="gray" radius='full' className='cursor-pointer' onClick={handleCancel}>
                            Cancel
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button variant="solid" color="red" radius='full' className='cursor-pointer' onClick={e => handleOk(id)}>
                            &nbsp;Yes&nbsp;
                        </Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default Alert