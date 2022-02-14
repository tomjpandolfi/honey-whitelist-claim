import React from "react"
import { Button as DegenButton, Text } from "degen"

const Button = (props: {
  title: string
  onClick: Function
  className: string
  secondary: boolean
}) => {
  const { title, onClick } = props

  return (
    <DegenButton
      variant={props.secondary ? "secondary" : "primary"}
      tone="red"
      width="80"
      onClick={() => onClick()}
    >
      <Text>{title}</Text>
    </DegenButton>
  )
}

export default Button
