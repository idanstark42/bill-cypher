import { useLoading } from '../helpers/use-loading'

export default function Loader () {
  const { loading } = useLoading()
  return loading ? <div className='loader' /> : ''
}