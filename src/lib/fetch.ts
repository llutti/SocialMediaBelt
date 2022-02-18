interface IPost<T>
{
  url: string;
  data: T;
}

const executePost = async <T>({ url, data }: IPost<T>) =>
{
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

interface IDelete
{
  url: string;
}

const executeDelete = async ({ url }: IDelete) =>
{
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
    },
  });

  return res.json();
}

export { executePost, executeDelete }