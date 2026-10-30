import { sealData } from 'iron-session';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

import requiredEnvVar from 'utils/requiredEnvVar';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const redirectUrl = request.nextUrl.searchParams.get('redir');

  if (!token || !redirectUrl) {
    return notFound();
  }

  let isExpired = true;

  try {
    const decodedToken = jwtDecode(token);
    const tokenExpiry = decodedToken.exp;
    isExpired = !tokenExpiry || tokenExpiry < new Date().getTime() / 1000;
  } catch {
    //TODO: Redirect to page where you can get new token
    return notFound();
  }

  if (isExpired) {
    //TODO: Redirect to page where you can get new token
    return notFound();
  }

  const client_id = process.env.ZETKIN_CLIENT_ID;
  const client_secret = process.env.ZETKIN_CLIENT_SECRET;

  try {
    const res = await fetch('http://api.dev.zetkin.org/v1/oauth/token', {
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${token}`,
      headers: {
        authorization: 'Basic ' + btoa(`${client_id}:${client_secret}`),
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const tokenData = await res.json();

    const sealedSession = await sealData(
      {
        redirAfterLogin: null,
        tokenData,
      },
      {
        password: requiredEnvVar('SESSION_PASSWORD'),
      }
    );

    const cookieStore = cookies();
    cookieStore.set({
      name: 'zsid',
      value: sealedSession,
    });
  } catch {
    //TODO: Redirect to page where you can get new token
    return notFound();
  }

  return redirect(redirectUrl);
}
