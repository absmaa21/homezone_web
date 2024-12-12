import {useEffect, useState} from "react";

interface useQueryProps {
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  header?: HeadersInit,
  body?: BodyInit,
  enabled?: boolean,
}

function useQuery({url, method = 'GET', header, body, enabled}: useQueryProps): QueryResponse {

  const [queryResponse, setQueryResponse] = useState<QueryResponse>({
    data: null,
    status: 0,
    message: '',
    ok: false,
    isFetching: true,
  })

  useEffect(() => {
    queryFetch()
  }, []);


  async function queryFetch() {
    if (!enabled) return

    setQueryResponse(p => ({...p, isFetching: true}))

    const r = await fetch(url, {
      method,
      headers: {
        ...header,
        "Content-Type": "application/json",
      },
      body,
    })

    setQueryResponse(p => ({...p, ok: r.ok, status: p.status}))

    setQueryResponse(p => ({...p, isFetching: false}))
  }

  return queryResponse
}

export default useQuery;