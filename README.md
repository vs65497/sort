# sort
Practice project: Visually represents a few sorting algorithms using Javascript ES5 and Canvas.

Von Simmons, December 2018

I wanted to see if I could recreate something like this video (https://www.youtube.com/watch?v=kPRA0W1kECg) in Javascript. Admittedly this is a much more simplified version of the video. I'm not really bothered by it though as this was more of a challenge to learn about efficiency - to have a more visual understanding of Big O. It also provided a unique challenge in slowing down the sort to draw every step. 

Initially I had planned on tracking how long the sort was running and how many steps it needed to complete. But I quickly ran into trouble when working on the recursive sorting algorthims. I wanted to write this in a way where it would be portable and easily extendable, however I didn't account for recusion when I set out. As a result, this had to be abandoned. It also caused me to abandon showing when the sort was completed.

I also found that Javascript is really not too great at playing sounds. I wasn't able to quickly repeat any single file as if it refused to play two files at once. I'm not sure why this is the case.
