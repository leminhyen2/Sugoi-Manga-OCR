
"""
Module: segmentation.py
Desc: Segment raw manga scan into text/nontext areas
Author: John O'Neil
Email: oneil.john@gmail.com
DATE: Friday, August 30th 2013

  Input a manga raw scan image.
  Output a single image with text
  areas blocked in color. 
"""

import numpy as np
import math
import cv2
import scipy.ndimage

import ImageTextExtraction.connected_components as cc
import ImageTextExtraction.run_length_smoothing as rls
import ImageTextExtraction.clean_page as clean
import ImageTextExtraction.arg as arg
import ImageTextExtraction.defaults as defaults


def segment_image_file(filename, option):
  img = cv2.imread(filename)
  gray = clean.grayscale(img)
  #cv2.imwrite("result.png",segment_image(gray, option))
  return segment_image(gray, option)

def segment_image(img, option, max_scale=defaults.CC_SCALE_MAX, min_scale=defaults.CC_SCALE_MIN):
  (h,w)=img.shape[:2]

  #create gaussian filtered and unfiltered binary images
  binary_threshold = arg.integer_value('binary_threshold',default_value=defaults.BINARY_THRESHOLD)
  if arg.boolean_value('verbose'):
    print('binarizing images with threshold value of ' + str(binary_threshold))
  binary = clean.binarize(img,threshold=binary_threshold)

  binary_average_size = cc.average_size(binary)

  sigma = (0.8/676.0)*float(h)-0.9
  sigma = arg.float_value('sigma',default_value=sigma)

  gaussian_filtered = scipy.ndimage.gaussian_filter(img, sigma=sigma)
  
  gaussian_binary = clean.binarize(gaussian_filtered,threshold=binary_threshold)
  
  #Draw out statistics on average connected component size in the rescaled, binary image
  average_size = cc.average_size(gaussian_binary)

  max_size = average_size*max_scale
  min_size = average_size*min_scale

  #primary mask is connected components filtered by size
  mask = cc.form_mask(gaussian_binary, max_size, min_size)
  
  #apply mask and return images
  cleaned = cv2.bitwise_not(mask * binary)
  text_only = cleaned2segmented(cleaned, average_size)

  text_like_areas = filter_text_like_areas(option, segmentation=text_only, average_size=average_size)

  text_only = np.zeros(img.shape)
  segmented_image = cc.draw_bounding_boxes(text_only, text_like_areas,color=(255),line_size=-1)

  return segmented_image

def cleaned2segmented(cleaned, average_size):
  vertical_smoothing_threshold = defaults.VERTICAL_SMOOTHING_MULTIPLIER*average_size
  horizontal_smoothing_threshold = defaults.HORIZONTAL_SMOOTHING_MULTIPLIER*average_size
  (h,w)=cleaned.shape[:2]

  run_length_smoothed = rls.RLSO( cv2.bitwise_not(cleaned), vertical_smoothing_threshold, horizontal_smoothing_threshold)
  components = cc.get_connected_components(run_length_smoothed)
  text = np.zeros((h,w),np.uint8)

  for component in components:
    seg_thresh = arg.integer_value('segment_threshold',default_value=1)
    (aspect, v_lines, h_lines) = segment_into_lines(cv2.bitwise_not(cleaned), component,min_segment_threshold=seg_thresh)
    if len(v_lines)<2 and len(h_lines)<2:continue
    draw_2d_slices(text,[component],color=255,line_size=-1)
  return text

def segment_into_lines(img,component, min_segment_threshold=1):
  (ys,xs)=component[:2]
  w=xs.stop-xs.start
  h=ys.stop-ys.start
  x = xs.start
  y = ys.start
  aspect = float(w)/float(h)

  vertical = []
  start_col = xs.start
  for col in range(xs.start,xs.stop):
    count = np.count_nonzero(img[ys.start:ys.stop,col])
    if count<=min_segment_threshold or col==(xs.stop):
      if start_col>=0:
        vertical.append((slice(ys.start,ys.stop),slice(start_col,col)))
        start_col=-1
    elif start_col < 0:
      start_col=col

  #detect horizontal rows of non-zero pixels
  horizontal=[]
  start_row = ys.start
  for row in range(ys.start,ys.stop):
    count = np.count_nonzero(img[row,xs.start:xs.stop])
    if count<=min_segment_threshold or row==(ys.stop):
      if start_row>=0:
        horizontal.append((slice(start_row,row),slice(xs.start,xs.stop)))
        start_row=-1
    elif start_row < 0:
      start_row=row
  return (aspect, vertical, horizontal)

def draw_2d_slices(img,slices,color=(0,0,255),line_size=1):
  for entry in slices:
    vert=entry[0]
    horiz=entry[1]
    cv2.rectangle(img,(horiz.start,vert.start),(horiz.stop,vert.stop),color,line_size)

def filter_text_like_areas(option, segmentation, average_size):
  #see if a given rectangular area (2d slice) is very text like

  areas = cc.get_connected_components(segmentation)
  text_like_areas = []
  
  for area in areas:
    text_like_areas.append(area)

  return text_like_areas





