# Eluta Chrome Extension

Quickly copy and paste harvester configurations

**HOWTO:**

1. Go to the template harvester -> dump as JSON (at the bottom)
2. Extension -> Copy
3. Create new harvester, add a name and save it
4. Paste and hope for no errors

**TODO:**

- **Implement paste functionality**
  - find null values using extra testtttt harvester (empty harvester with just name)
  - use .value on a dropdownbox with the corrosponding option value
  - didnt implement:
    - def sync
    - ignore dupe urls
    - notes
- partial paste
  - select what items to be pasted
- Style extension popout
- Favourites menu! - use sync storage
- ATS generator based on url
  - copy from empty harvester and make changes
- Eluta pages recolour
- Count jobs for editors?