import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { LoginFields } from '../../Types'
import { increment, decrement } from "../../redux/counterSlice/counterSlice"
import { useAppSelector, useAppDispatch } from "../../redux/hooks"
import axios from 'axios'

export default function LoginForm() {
  const [fields, setFields] = useState<LoginFields>({ username: 'OtherGuyt', password: '147369' })
  const [userData, setUserData] = useState<any>({userInfo: {username: 'Not logged'}})

  const dispatch = useAppDispatch()
  const count = useAppSelector((state) => state.counter.value)
  
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const key = e.target.name

    setFields({ ...fields, [key]: value})
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (fields.username && fields.password) {
        const data = await axios.post('http://localhost:3005/auth/login',  fields );
        setUserData(data.data)
      }
    } catch (error) {
      console.error(error);
      alert('Error loggin in please try again')
    }
  }

  useEffect(() => {
    console.log(userData);
  }, [userData])

  return (
    <div>
      <h1>{userData.userInfo.username}</h1>
      <div>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
        <span>{count}</span>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="">Username </label>
          <input type="text" name="username" onChange={onChange} />
        </div>
        <div>
          <label htmlFor="">Password </label>
          <input type="password" name="password" onChange={onChange} />
        </div>
        <input type="submit" value='Submit' />
      </form>
    </div>
  )
}
