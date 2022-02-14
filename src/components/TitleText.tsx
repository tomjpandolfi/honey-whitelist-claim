import { Text } from "degen"
import React from "react"

const TitleText = (props: any) => {
  return (
    <Text as="h1" weight="semiBold" variant="extraLarge" color="white">
      {props.children}
    </Text>
  )
}

export default TitleText
