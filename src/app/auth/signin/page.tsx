import {
    Flex,
    Button,
    Text,
    TextField,
    Strong,
    Link
} from "@radix-ui/themes";

const SignIn = () => {
    return (
        <Flex>
            <Text>Don`t have an account
                <Link href="/auth/signup"><Strong>Sign Up</Strong></Link>
            </Text>
        </Flex>
    )
}

export default SignIn;