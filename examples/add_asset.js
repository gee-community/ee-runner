var collection_name = "users/gena/"
var file_path = "gs://hydro-earth/hand/HAND_100_cell_00028.tif"
var file_name = "test"
var asset_name = collection_name + file_name

var request = {"id": asset_name,
              "tilesets": [
                  {"sources": [
                      {"primaryPath": file_path,
                       "additionalPaths": []}
                  ]}
              ],
              "bands": [],
              "reductionPolicy": "MEAN"}

var taskid = ee.data.newTaskId(1)

ee.data.startIngestion(taskid, request)
