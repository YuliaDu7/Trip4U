const endpoint = 'https://api.openai.com/v1/chat/completions';
export async function fetchUserData(loggedUser, apiUrl) {
  try {
    const response = await fetch(`${apiUrl}/Actions/Getclick?loggedUser=${loggedUser}`);
    const data = await response.json();


    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: "Find up to 3 users most similar to the logged-in user based on the provided data. " +
                   "Respond with an array of exactly 3 usernames, excluding the logged-in user's username. " +
                   "If you cannot find 3 similar users, use empty strings to fill the array. " +
                   "Provide no other text or information, and ensure the logged-in user's username is not included in the array."
        },
        {
          role: 'user',
          content: JSON.stringify({
            loggedusername: loggedUser,
            data: data
          })
        }
      ],
      max_tokens: 50,
      temperature: 0.5,
      n: 1,
      stop: null
    };

    const options1 = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestData)
    };

    const apiResponse = await fetch(endpoint, options1);
    const result = await apiResponse.json();
    const message = result.choices[0].message.content.trim();
    

    // Parse the message to get the array of usernames
    const recommendedUsers = JSON.parse(message);
    const jsonString = JSON.stringify(recommendedUsers);

    const options2 = {
      method: 'PUT',
      body: jsonString,
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8'
      }),
    };

    const recommendedUsersFinal = await fetch(apiUrl+"/Actions/GetInfluancer", options2);
    const finalData = await recommendedUsersFinal.json();
    
    return finalData; // החזרת הנתונים הסופיים
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export async function fetchTripData(loggedUser, apiUrl) {
  try {
    const response = await fetch(apiUrl+`/Actions/GetTripClick?loggedUser=${loggedUser}`);
    const responseText = await response.text(); 
    const data = JSON.parse(responseText);

    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Based on the user's click data and preferences, recommend the top 3 trips that best match the user's interests. Please consider the frequency of clicks on different types, properties, and tags, and align the recommendations with the user's stated preferences. Return only a JSON array of objects, each containing 'tripId', 'tripTitle','userName', and up to 2 'tags'. Provide nothing else, only the array.`
        },
        {
          role: 'user',
          content: JSON.stringify(data)
        }
      ],
      //הכמות שנשלחת לצאט
      max_tokens:4096,
      temperature: 0.5,
      n: 1,
      stop: null
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestData)
    };

    const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', options);
    const result = await apiResponse.json();
    const message = result.choices[0].message.content.trim();

    const recommendedTrips = JSON.parse(message);
    return recommendedTrips;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}


export async function handleKeyDown(event, apiUrl, send2ParentsOptions) {
 console.log("log - user search", event.target.value);
  if (event.key !== 'Enter') {
    return;
  }
if (event.target.value==="")
  return;
  
  
  const userRequest = event.target.value;

  const requestData = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `
         You are an assistant that helps users find suitable trips based on their request. Choose criteria only if they are explicitly mentioned in the user's request. Do not make any assumptions.

        The preferences should be translated into the following search criteria:

        1. Type of trip (typeId): 
          - 1: include water like river (choose only if the user explicitly mentions water or river)
          - 2: Walking (choose only if the user explicitly mentions walking)
          - 3: Attractions (choose only if the user explicitly mentions attractions)
          - 4: Culture (choose only if the user explicitly mentions culture)
          - 5: Museums and exhibitions (choose only if the user explicitly mentions museums or exhibitions)
          - 6: Nature - walking in nature (choose only if the user explicitly mentions nature or walking in nature)
          - 7: Biking (choose only if the user explicitly mentions biking)
          - 8: Culinary (choose only if the user explicitly mentions culinary or food)

        2. Properties (propertyId):
          - 6: trip open on Saturday (choose only if the user explicitly mentions Saturday)
          - 7: trip suitable for dogs (choose only if the user explicitly mentions dogs)
          - 1: trip suitable for couples (choose only if the user explicitly mentions couples)
          - 8: trip suitable for families (choose only if the user explicitly mentions families)
          - 5: trip have accessibility (choose only if the user explicitly mentions accessibility)
          - 4: free entry (choose only if the user explicitly mentions free entry)
          - 3: Easy route (choose only if the user explicitly mentions easy route)
          - 2: Hard route (choose only if the user explicitly mentions hard route)
            
        3. Regions (area):
          - N: North (choose only if the user explicitly mentions the North)
          - C: Center (choose only if the user explicitly mentions the Center)
          - S: South (choose only if the user explicitly mentions the South)
          -null (if not specific)

        4. Season (season):
          - ק: Summer (choose only if the user explicitly mentions summer)
          - ח: Winter (choose only if the user explicitly mentions winter)
          - ס: Autumn (choose only if the user explicitly mentions autumn)
          - א: Spring (choose only if the user explicitly mentions spring)
          -null (if not specific)

        When responding to a user request, use the exact options provided above and return the response in the following JSON format:
        {
          "typeId": [], // List of selected type IDs
          "propertyId": [], // List of selected property IDs
          "area": null, // Selected area
          "season": null // Selected season
        }
      `
      },
      {
        role: 'user',
        content: userRequest
      }
    ],
    max_tokens: 150,
    temperature: 0.5,
    n: 1,
    stop: null
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestData)
  };

  try {
    const response = await fetch(endpoint, options);
    const result = await response.json();
    const message = result.choices[0].message.content.trim();
    console.log("Response from OpenAI:", message);

    let jsonData;
    try {
      jsonData = JSON.parse(message);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return;
    }

    console.log("Parsed JSON data:", JSON.stringify(jsonData));
    let url = apiUrl + "/Search/Search";
    let options2 = {
      method: "POST",
      body: JSON.stringify(jsonData),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    };


    const searchResponse = await fetch(url, options2);
    const searchData = await searchResponse.json();

    console.log("Response from controller:", searchData);

    if (searchData.length === 0) {
      console.log("No matching trips found.");
    }
    if (searchData.length === 1) {
      send2ParentsOptions(searchData);
    }
    else {
     
      const tripsForSorting = searchData.map(trip => ({
        tripId: trip.tripId,
        tags: trip.tags
      }));

     
      const sortingRequestData = {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
                     You are an assistant that helps users find suitable trips. Now, sort the following trips by their relevance to the user's request provided earlier:
        - The trips data will be provided as an array in the "trips" key (with only tripId and tags).
        - The user's request data will be provided as an object in the "preferences" key.
        Do not remove any trips from the list. Instead, sort all trips based on how well their tags match the user's preferences. Return only an array of tripId sorted from most relevant to least relevant.

            `
          },
          {
            role: 'user',
            content: JSON.stringify({
              trips: tripsForSorting,
              preferences: userRequest
            })
          }
        ],
        max_tokens: 4096,
        temperature: 0.5,
        n: 1,
        stop: null
      };

      const sortingOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(sortingRequestData)
      };

      const sortingResponse = await fetch(endpoint, sortingOptions);
      const sortingResult = await sortingResponse.json();
      const sortedTripsIds = sortingResult.choices[0].message.content.trim();

      let sortedTrips;
      try {
        sortedTrips = JSON.parse(sortedTripsIds);
      } catch (e) {
        console.error("Failed to parse sorted trips JSON:", e);
        return;
      }

      console.log("Sorted trips by relevance:", sortedTrips);

    
      const sortedTripsData = sortedTrips.map(id => searchData.find(trip =>  trip.tripId.toString() === id.toString()))
      console.log(sortedTripsData)
      send2ParentsOptions(sortedTripsData);
    }

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
