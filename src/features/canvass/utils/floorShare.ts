export type FloorShareResponse = 'no' | 'yes' | null;

export type FloorShareHousehold = {
  name: string;
  responses: FloorShareResponse[];
};

export type FloorShare = {
  floor: number;
  households: FloorShareHousehold[];
  lastVisitedHoursAgo: (number | null)[];
  questions: string[];
  successMask: number;
};

export function formatFloorShareHouseholdName(
  floor: number,
  householdIndex: number
): string {
  return `${String(floor).padStart(2, '0')}${String(householdIndex).padStart(
    2,
    '0'
  )}`;
}

export function encodeFloorShare(share: FloorShare): string {
  const bytes = packHouseholdResponses(
    share.households,
    share.questions.length
  );
  const encodedQuestions = encodeBase64Url(
    encodeUtf8(share.questions.join('\0'))
  );
  const encodedHouseholdNames = encodeBase64Url(
    encodeUtf8(share.households.map(({ name }) => name).join('\0'))
  );
  const recentBytes = packLastVisited(share.lastVisitedHoursAgo);

  return `${share.floor.toString(36)}.${encodeBase64Url(bytes)}.${encodedQuestions}.${encodedHouseholdNames}.${share.successMask.toString(36)}.${encodeBase64Url(recentBytes)}`;
}

export function decodeFloorShare(value: string): FloorShare | null {
  const [
    floorValue,
    encodedResponses = '',
    encodedQuestions = '',
    encodedHouseholdNames = '',
    successMaskValue = '0',
    encodedLastVisited = '',
  ] = value.split('.');

  const floor = Number.parseInt(floorValue, 36);
  const successMask = Number.parseInt(successMaskValue, 36);

  if (
    !Number.isInteger(floor) ||
    !encodedResponses ||
    encodedLastVisited === undefined ||
    !Number.isInteger(successMask) ||
    successMask < 0
  ) {
    return null;
  }

  const bytes = decodeBase64Url(encodedResponses);
  const questionBytes = decodeBase64Url(encodedQuestions);
  const recentBytes = decodeBase64Url(encodedLastVisited);

  if (!bytes || !questionBytes || !recentBytes) {
    return null;
  }

  const questions =
    questionBytes.length === 0 ? [] : decodeUtf8(questionBytes).split('\0');

  if (questions.length > 0 && questions.some((question) => !question)) {
    return null;
  }

  if (questions.length > 0 && successMask > (1 << questions.length) - 1) {
    return null;
  }

  const householdNames = decodeTextList(encodedHouseholdNames);
  const householdBytesLength = Math.max(
    1,
    Math.ceil((questions.length * 2) / 8)
  );
  const householdCount = Math.max(
    householdNames.length || 1,
    Math.ceil(bytes.length / householdBytesLength)
  );

  const households = Array.from({ length: householdCount }, (_, index) => {
    const start = index * householdBytesLength;
    const slice = bytes.slice(start, start + householdBytesLength);
    const responses = Array.from(
      { length: questions.length },
      (_, questionIndex) => {
        const offset = questionIndex * 2;
        const byteIndex = Math.floor(offset / 8);
        const bitIndex = offset % 8;
        const byte = slice[byteIndex] ?? 0;
        return decodeResponse((byte >> bitIndex) & 0b11);
      }
    );

    return {
      name:
        householdNames[index] ??
        formatFloorShareHouseholdName(floor, index + 1),
      responses,
    };
  });

  const lastVisitedHoursAgo = Array.from(
    { length: householdCount },
    (_, index) => {
      const byte0 = recentBytes[index * 2];
      const byte1 = recentBytes[index * 2 + 1];

      if (byte0 === undefined || byte1 === undefined) {
        return null;
      }

      const val = byte0 | (byte1 << 8);
      return val === 0xffff ? null : val;
    }
  );

  return {
    floor,
    households,
    lastVisitedHoursAgo,
    questions,
    successMask,
  };
}

function packHouseholdResponses(
  households: FloorShareHousehold[],
  questionCount: number
): number[] {
  const householdBytesLength = Math.max(1, Math.ceil((questionCount * 2) / 8));
  const bytes = new Array(households.length * householdBytesLength).fill(0);

  households.forEach(({ responses }, householdIndex) => {
    const baseIndex = householdIndex * householdBytesLength;

    responses.forEach((response, questionIndex) => {
      const encoded = encodeResponse(response);
      const offset = questionIndex * 2;
      const byteIndex = baseIndex + Math.floor(offset / 8);
      const bitIndex = offset % 8;
      const mask = 0b11 << bitIndex;
      const current = bytes[byteIndex] ?? 0;
      bytes[byteIndex] = (current & ~mask) | ((encoded << bitIndex) & mask);
    });
  });

  return bytes;
}

function decodeTextList(value: string): string[] {
  if (!value) {
    return [];
  }

  const bytes = decodeBase64Url(value);
  if (!bytes) {
    return [];
  }

  return decodeUtf8(bytes).split('\0');
}

function encodeUtf8(value: string): number[] {
  if (typeof TextEncoder !== 'undefined') {
    return Array.from(new TextEncoder().encode(value));
  }

  if (typeof Buffer !== 'undefined') {
    return Array.from(Buffer.from(value, 'utf8'));
  }

  throw new Error('TextEncoder is not available in this environment');
}

function decodeUtf8(value: number[]): string {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder().decode(new Uint8Array(value));
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value).toString('utf8');
  }

  throw new Error('TextDecoder is not available in this environment');
}

function encodeResponse(response: FloorShareResponse): number {
  return response === null ? 0 : response === 'no' ? 1 : 2;
}

function decodeResponse(value: number): FloorShareResponse {
  return value === 0 ? null : value === 1 ? 'no' : value === 2 ? 'yes' : null;
}

function packLastVisited(lastVisitedHoursAgo: (number | null)[]): number[] {
  const bytes: number[] = [];

  lastVisitedHoursAgo.forEach((hoursAgo) => {
    if (hoursAgo === null || hoursAgo < 0 || !Number.isFinite(hoursAgo)) {
      bytes.push(0xff, 0xff);
    } else {
      const hours = Math.min(Math.floor(hoursAgo), 0xfffe);
      bytes.push(hours & 0xff, (hours >> 8) & 0xff);
    }
  });

  return bytes;
}

// Encode UTF-8 bytes as URL-safe Base64 in both browser and server contexts.
function encodeBase64Url(bytes: number[]): string {
  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';

  for (let index = 0; index < bytes.length; index += 3) {
    const byte0 = bytes[index];
    const byte1 = bytes[index + 1] ?? 0;
    const byte2 = bytes[index + 2] ?? 0;
    const combined = (byte0 << 16) | (byte1 << 8) | byte2;

    result += alphabet[(combined >> 18) & 0x3f];
    result += alphabet[(combined >> 12) & 0x3f];
    if (index + 1 < bytes.length) {
      result += alphabet[(combined >> 6) & 0x3f];
    }
    if (index + 2 < bytes.length) {
      result += alphabet[combined & 0x3f];
    }
  }

  return result;
}

function decodeBase64Url(value: string): number[] | null {
  const alphabet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;

  for (const character of value) {
    const digit = alphabet.indexOf(character);
    if (digit < 0) {
      return null;
    }

    buffer = (buffer << 6) | digit;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
    }
  }

  return bytes;
}
