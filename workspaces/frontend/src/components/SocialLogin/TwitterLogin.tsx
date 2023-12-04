import { useCallback, useState } from 'react'
import {
    IResolveParams,
    LoginSocialTwitter
} from './LoginSocialTwitterLib'
import { User } from './User'; // component display user (see detail on /example directory)

// // CUSTOMIZE ANY UI BUTTON
import {
    TwitterLoginButton
} from 'react-social-login-buttons'

// REDIRECT URL must be same with URL where the (reactjs-social-login) components is located
// MAKE SURE the (reactjs-social-login) components aren't unmounted or destroyed before the ask permission dialog closes

const REDIRECT_URI = window?.location?.href ?? 'http://localhost:3000/delegates/create'
const CLIENT_ID = import.meta.env.VITE_APP_TW_CLIENT_ID ?? "";
console.log('CLIENT_ID', CLIENT_ID)

const TwitterLogin = () => {
  const [provider, setProvider] = useState('')
  const [profile, setProfile] = useState<any>()

  const onLoginStart = useCallback(() => {
    alert('login start')
  }, [])

  const onLogoutSuccess = useCallback(() => {
    setProfile(null)
    setProvider('')
    alert('logout success')
  }, [])

  return (
    <>
      {provider && profile ? (
        <User provider={provider} profile={profile} onLogout={onLogoutSuccess} />
      ) : (
        <div className={`App ${provider && profile ? 'hide' : ''}`}>
          <h1 className='title'>ReactJS Social Login</h1>

            <LoginSocialTwitter
              isOnlyGetToken
              // client_id={process.env.REACT_APP_TWITTER_V2_APP_KEY || ''}
              client_id={CLIENT_ID || ''}
              redirect_uri={REDIRECT_URI}
              onLoginStart={onLoginStart}
              onResolve={({ provider, data }: IResolveParams) => {
                alert('login success')
                setProvider(provider)
                setProfile(data)
              }}
              onReject={(err: any) => {
                console.log(err)
              }}
            >
              <TwitterLoginButton />
            </LoginSocialTwitter>
        </div>
      )}
    </>
  )
}

export default TwitterLogin