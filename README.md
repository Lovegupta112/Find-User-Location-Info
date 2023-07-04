# Find-User-Location-Info
## Project Overview
### Task
- Get user's IP Address using js scripts, refer to the gfg link given. - https://www.geeksforgeeks.org/how-to-get-client-ip-address-using-javascript/
- Once done, hit an api request at https://ipinfo.io/${IP}/geo , where ${IP} will be the IP of the user.
- Get the IP Address on the load of the page, where as get the information from the API on the click of the button.
- Using the lat,long given in the location of the json which you'll get in point 3, show the user's location on google map.
- Using the timezone given from the json in point 3 get the time of the user's location - refer to this https://usefulangle.com/post/382/javascript-get-date-time-for-timezone
- Please note that you have to get current time from the given TIME ZONE, and not your time.
- From the pincode in the json, send a get req to another API https://api.postalpincode.in/pincode/${pincode} - where ${pincode} is the pincode received in point 3.
- This will give you a list of post offices in that pincode. Map and show all the post offices available in that area.
- Also create a search box and filter the postal offices by name and branch office.
