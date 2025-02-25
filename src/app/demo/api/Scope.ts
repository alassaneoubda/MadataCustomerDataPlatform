interface tagsStatus{
    label: string;
    value: string;
}

export interface Scope {
    itemId?: string;
    itemType?: string
    scope?: string;
    version?: 0,
    metadata?: {
      id?: string;
      name?: string;
      description?: string;
      scope?: string;
      tags?: tagsStatus;
      systemTags?: [
        string
      ];
      enabled?: true;
      missingPlugins?: true;
      hidden?: true;
      readOnly?: true

}

}

export interface EventItem {
  itemId: string;
  itemType: string;
  scope: string;
  version: number;
  eventType: string;
  sessionId: string;
  profileId: string;
  timeStamp: string;
  tags?: string[]; // Optional
  channel?: string; // Optional
  location?: string; // Optional
  properties?: { [key: string]: any }; // Optional
  indexedData?: { [key: string]: any }; // Optional
  profile: {
    itemId: string;
    itemType: string;
    scope: string;
    version: number;
    consents: { [key: string]: { status: string } };
  };
  source: {
    itemId: string;
    itemType: string;
  };
  target: {
    itemId: string;
    itemType: string;
  };
}
