import React from "react";
import { CustomCard, LaneFooter, LaneHeader } from "../../../components/BoardComponent";
import { useEditTaskMutation, useListTaskQuery } from "../../../state/taskSlice";
import Board from "react-trello";
import { TaskForm } from "../../taskScreen/taskComponent/TaskForm";
import Box from "@mui/material/Box";
import { Dialog } from "@mui/material";
import PropTypes from "prop-types";

export const TaskBoard = (data) => {
  console.log(data, "filter taks");
  const taskType = sessionStorage.getItem("taskType");
  const { data: allList = [], isLoading: loadingAllTask } = useListTaskQuery();

  var rawList = [];
  if (taskType === "unassigned") {
    allList.map((item) => {
      if (item.sourceModel === "Unassigned") {
        rawList.push(item);
      }
    });
  } else if (taskType === "bucket") {
    allList.map((item) => {
      if (item.sourceModel === "Bucket") {
        rawList.push(item);
      }
    });
  } else if (taskType === "checklist") {
    allList.map((item) => {
      if (item.sourceModel === "Checklist") {
        rawList.push(item);
      }
    });
  }
  var taskFilter = [];

  taskFilter = rawList.filter((item) => !data.data.includes(item.progress));

  // if (data.data.includes("Completed")) {
  //   taskFilter = rawList.filter((item) => !data.data.includes(item.progress));
  // } else {
  //   taskFilter = rawList.filter(
  //     (item) => item.progress == "Ongoing" || item.progress == "Not started"
  //   );
  // }

  const [editTask] = useEditTaskMutation();
  const [editOpen, setEditOpen] = React.useState(false);
  const [taskId, setTaskId] = React.useState();

  const handleEditClose = () => {
    setEditOpen(false);
  };

  var board;

  if (!loadingAllTask) {
    const groupBy = (array, key) => {
      // Return the end result
      return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
      }, {}); // empty object is the initial value for result object
    };

    const filteredList = taskFilter.map(
      ({
        name: title,
        _id: id,
        description,
        priority,
        comment,
        progress,
        assignedTo,
        dueDate,
      }) => ({
        title,
        id,
        description,
        assignedTo,
        dueDate,
        priority,
        progress,
        comment,
      })
    );

    const filteredResult = groupBy(filteredList, "priority");
    console.log(filteredResult, "filtered result");

    const priority = ["Low", "Medium", "High", "None"];
    var emptyArr = [];

    var newArr = priority.filter((item) => !data.data.includes(item));

    newArr.map((value, key) => {
      if (filteredResult[value]) {
        if (value === "Low") {
          emptyArr.push({
            id: key + 1,
            title: value,
            cards: filteredResult[value],
            cardStyle: { backgroundColor: "white" },
          });
        } else if (value === "Medium") {
          emptyArr.push({
            id: key + 1,
            title: value,
            cards: filteredResult[value],
            cardStyle: { backgroundColor: "white" },
          });
        } else if (value === "High") {
          emptyArr.push({
            id: key + 1,
            title: value,
            cards: filteredResult[value],
            cardStyle: { backgroundColor: "white" },
          });
        } else if (value === "None") {
          emptyArr.push({
            id: key + 1,
            title: "None",
            cards: filteredResult[value],
            cardStyle: { backgroundColor: "#e8faed" },
          });
        }
      } else {
        emptyArr.push({
          id: key + 1,
          title: value,
          cards: [],
        });
      }
    });

    console.log(emptyArr, "empty");

    board = {
      lanes: emptyArr,
    };
  }

  // LaneFooter.propTypes = {
  //   cards: PropTypes.object,
  // };

  LaneFooter.defaultProps = {
    cards: emptyArr,
  };
  const components = {
    Card: CustomCard,
    LaneHeader: LaneHeader,
    NewLaneSection: LaneFooter,
  };

  return (
    <Box>
      {loadingAllTask ? (
        "Loading... "
      ) : (
        <>
          <Board
            collapsibleLanes
            components={components}
            data={board}
            style={{
              backgroundColor: "#f2f3f5",
              overflowX: "auto",
              height: "100%",
              width: "1200px",
            }}
            cardStyle={{}}
            laneStyle={{
              width: 240,
              height: "100%",
              backgroundColor: "#f2f3f5",
            }}
            onCardClick={(id) => {
              setTaskId(id);
              setEditOpen(true);
            }}
            handleDragEnd={(cardId, sourceLaneId, targetLaneId, position, cardDetails, e) => {
              const priority = ["Low", "Medium", "High", "None"];
              var priorityColumn = targetLaneId - 1;
              var newPriority = priority[priorityColumn];
              const updatedTask = {
                id: cardDetails.id,
                body: {
                  priority: newPriority,
                },
              };
              editTask(updatedTask);
            }}
          />
          <Dialog open={editOpen} onClose={handleEditClose}>
            <TaskForm taskId={taskId}></TaskForm>
          </Dialog>
        </>
      )}
    </Box>
  );
};
