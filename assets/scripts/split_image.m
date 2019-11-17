clear all; close all; clc;

full = imread('../images/mandelbrot_full.png');

% full = [full(:,:,1), full(:,:,3), full(:,:,2)];
hold = full(:,:,3);
full(:,:,3) = full(:,:,2);
full(:,:,2) = hold;

full = 0.7*full;

imwrite(imresize(full(1:3485,:,:),0.5), '../images/mandelbrot_upper.png');
imwrite(imresize(full(3486:end,:,:),0.5), '../images/mandelbrot_lower.png');