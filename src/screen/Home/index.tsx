import React from 'react'
import { connect } from 'react-redux'
import { RootState } from 'internal/interface'
import { Redirect } from 'react-router-dom'
import { AppHeader } from 'internal/Header'
import { AppBody } from 'internal/AppWrapper'

export const Home = () => {
  return (
    <>
      <AppHeader />
      <AppBody>Xin chào</AppBody>
    </>
  )
}
