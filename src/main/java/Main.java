} else if (command.equals("jobs")) {
                List<Integer> jobNums = new ArrayList<>(backgroundJobs.keySet());
                int currentJob = jobNums.isEmpty() ? -1 : jobNums.get(jobNums.size() - 1);
                int previousJob = jobNums.size() >= 2 ? jobNums.get(jobNums.size() - 2) : -1;
                List<Integer> toRemove = new ArrayList<>();
                for (int jobNum : jobNums) {
                    Process p = backgroundJobs.get(jobNum);
                    boolean alive = p.isAlive();
                    String status = alive ? "Running" : "Done";
                    String cmdStr = backgroundCommands.get(jobNum) + (alive ? " &" : "");
                    String padded = String.format("%-23s", status);
                    String marker;
                    if (jobNum == currentJob) {
                        marker = "+";
                    } else if (jobNum == previousJob) {
                        marker = "-";
                    } else {
                        marker = " ";
                    }
                    System.out.println("[" + jobNum + "]" + marker + "  " + padded + " " + cmdStr);
                    if (!alive) {
                        toRemove.add(jobNum);
                    }
                }
                for (int jobNum : toRemove) {
                    backgroundJobs.remove(jobNum);
                    backgroundCommands.remove(jobNum);
                }
            }