import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { LoginFields } from '../../Types'
import axios from 'axios'

export default function LoginForm() {
  const [fields, setFields] = useState<LoginFields>({ id: '63aeebdc2d2325571dd4aeae', username: 'asd', password: '987654321' })
  
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const key = e.target.name

    setFields({ ...fields, [key]: value})
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (fields.username && fields.password) {
      const data = await axios.post('http://localhost:3005/auth/login',  fields );
    }
  }

  return (
    <div>
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
